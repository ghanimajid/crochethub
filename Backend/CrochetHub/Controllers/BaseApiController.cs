using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CrochetHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public abstract class BaseApiController : ControllerBase
    {
        protected int? GetUserID()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (claim == null) return null;
            return int.Parse(claim);
        }

        protected string GetUserRole() =>
            User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;

        protected bool IsAdmin() => GetUserRole() == "Admin";
        protected bool IsInstructor() => GetUserRole() == "Instructor";
        protected bool IsStudent() => GetUserRole() == "Student";
    }
}
