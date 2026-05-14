using CrochetHub.Data;
using CrochetHub.DTOs.Auth;
using CrochetHub.Models;
using CrochetHub.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BC = BCrypt.Net.BCrypt;

namespace CrochetHub.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }
        public async Task<AuthResponseDto?> RegisterAsync(RegisterDto dto)
        {
            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return null;

            // check password
            if (!IsStrongPassword(dto.Password))
                throw new Exception(GetPasswordErrorMessage(dto.Password));

            // Get RoleID from Lookup
            var roleLookup = await _context.Lookups
                .FirstOrDefaultAsync(l => l.Value == dto.Role && l.Category == "ROLE");
            if (roleLookup == null) return null;

            // Create Person
            var person = new Person
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                DateOfBirth = dto.DateOfBirth,
                GenderID = dto.GenderID,
                CreatedAt = DateTime.UtcNow
            };
            _context.Persons.Add(person);
            await _context.SaveChangesAsync();

            // Create User using PersonID as UserID
            var user = new User
            {
                UserID = person.PersonID,
                Email = dto.Email,
                PasswordHash = BC.HashPassword(dto.Password),
                RoleID = roleLookup.LookupID,
                CreatedAt = DateTime.UtcNow
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Create Student or Instructor subtype
            if (dto.Role == "Student")
            {
                _context.Students.Add(new Student
                {
                    StudentID = user.UserID,
                    EnrollmentDate = DateTime.UtcNow
                });
            }
            else if (dto.Role == "Instructor")
            {
                _context.Instructors.Add(new Instructor
                {
                    InstructorID = user.UserID
                });
            }
            await _context.SaveChangesAsync();

            return new AuthResponseDto
            {
                Token = GenerateToken(user, dto.Role, dto.FirstName, dto.LastName),
                UserID = user.UserID,
                Email = user.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Role = dto.Role
            };
        }
        public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
        {
            var user = await _context.Users
                .Include(u => u.Person)
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || !BC.Verify(dto.Password, user.PasswordHash))
                return null;

            var role = user.Role?.Value ?? "Student";

            return new AuthResponseDto
            {
                Token = GenerateToken(user, role, user.Person?.FirstName ?? "", user.Person?.LastName ?? ""),
                UserID = user.UserID,
                Email = user.Email,
                FirstName = user.Person?.FirstName ?? "",
                LastName = user.Person?.LastName ?? "",
                Role = role
            };
        }
        public async Task<bool> ChangePasswordAsync(int userID, ChangePasswordDto dto)
        {
            var user = await _context.Users.FindAsync(userID);
            if (user == null || !BC.Verify(dto.CurrentPassword, user.PasswordHash))
                return false;
            if (!IsStrongPassword(dto.NewPassword))
                throw new Exception(GetPasswordErrorMessage(dto.NewPassword));
            user.PasswordHash = BC.HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> UpdateProfileAsync(int userID, UpdateProfileDto dto)
        {
            var user = await _context.Users
                .Include(u => u.Person)
                .FirstOrDefaultAsync(u => u.UserID == userID);

            if (user == null) return false;

            if (user.Person != null)
            {
                if (dto.FirstName != null) user.Person.FirstName = dto.FirstName;
                if (dto.LastName != null) user.Person.LastName = dto.LastName;
                if (dto.DateOfBirth != null) user.Person.DateOfBirth = dto.DateOfBirth;
                if (dto.GenderID != null) user.Person.GenderID = dto.GenderID;
            }

            if (dto.Bio != null) user.Bio = dto.Bio;
            if (dto.ProfilePicture != null) user.ProfilePicture = dto.ProfilePicture;

            await _context.SaveChangesAsync();
            return true;
        }
        private string GenerateToken(User user, string role, string firstName, string lastName)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, role),
                new Claim("FirstName", firstName),
                new Claim("LastName", lastName)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(
                    int.Parse(_config["Jwt:ExpiryInDays"] ?? "7")),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        private bool IsStrongPassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password) || password.Length < 8)
                return false;

            bool hasUpperCase = password.Any(char.IsUpper);
            bool hasLowerCase = password.Any(char.IsLower);
            bool hasDigit = password.Any(char.IsDigit);
            bool hasSpecialChar = password.Any(ch => !char.IsLetterOrDigit(ch));

            return hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
        }

        private string GetPasswordErrorMessage(string password)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(password))
                errors.Add("Password is required");
            else if (password.Length < 8)
                errors.Add("Password must be at least 8 characters");

            if (!password.Any(char.IsUpper))
                errors.Add("Password must contain at least one uppercase letter");

            if (!password.Any(char.IsLower))
                errors.Add("Password must contain at least one lowercase letter");

            if (!password.Any(char.IsDigit))
                errors.Add("Password must contain at least one number");

            if (!password.Any(ch => !char.IsLetterOrDigit(ch)))
                errors.Add("Password must contain at least one special character (!@#$%^&*)");

            return string.Join(", ", errors);
        }
    }
}
