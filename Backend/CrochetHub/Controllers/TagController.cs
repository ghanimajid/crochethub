using CrochetHub.Data;
using CrochetHub.DTOs.Tags;
using CrochetHub.Models;
using CrochetHub.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CrochetHub.Controllers
{
    public class TagController : BaseApiController
    {
        private readonly AppDbContext _context;
        private readonly IAuditService _auditService;

        public TagController(AppDbContext context, IAuditService auditService)
        {
            _context = context;
            _auditService = auditService;
        }

        // get api/tag - public
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tags = await _context.Tags
                .OrderBy(t => t.Name)
                .Select(t => new TagDto { TagID = t.TagID, Name = t.Name })
                .ToListAsync();

            return Ok(tags);
        }

        // get api/tag/{id} - public
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid tag ID." });

            var tag = await _context.Tags.FindAsync(id);
            if (tag == null)
                return NotFound(new { message = $"Tag with ID {id} not found." });

            return Ok(new TagDto { TagID = tag.TagID, Name = tag.Name });
        }

        // POST api/tag — Admin only
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateTagDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!IsAdmin())
                return Forbid();

            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest(new
                {
                    message = "Tag name is required."
                });

            // Duplicate check (case-insensitive)
            var exists = await _context.Tags
                .AnyAsync(t => t.Name.ToLower() == dto.Name.ToLower().Trim());

            if (exists)
                return Conflict(new
                {
                    message = $"Tag '{dto.Name}' already exists."
                });

            var tag = new Tag { Name = dto.Name.Trim() };

            _context.Tags.Add(tag);
            await _context.SaveChangesAsync();

            // Audit Log
            await _auditService.LogAsync(
                GetUserID()!.Value,
                "INSERT",
                "Tag",
                tag.TagID,
                null,
                $"Tag '{tag.Name}' created"
            );

            return CreatedAtAction(nameof(GetByID), new { id = tag.TagID },
                new TagDto { TagID = tag.TagID, Name = tag.Name });
        }

        // DELETE api/tag/{id} — Admin only
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            if (!IsAdmin()) return Forbid();

            if (id <= 0)
                return BadRequest(new { message = "Invalid tag ID." });

            var tag = await _context.Tags
                .Include(t => t.CourseTags)
                .Include(t => t.PatternTags)
                .FirstOrDefaultAsync(t => t.TagID == id);

            if (tag == null)
                return NotFound(new { message = $"Tag with ID {id} not found." });

            // Block deletion if tag is in use
            if (tag.CourseTags.Any() || tag.PatternTags.Any())
                return BadRequest(new
                {
                    message = $"Cannot delete tag '{tag.Name}' because it is assigned to " +
                              $"{tag.CourseTags.Count} course(s) and {tag.PatternTags.Count} pattern(s)."
                });

            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();

            // Audit Log
            await _auditService.LogAsync(
                GetUserID()!.Value,
                "DELETE",
                "Tag",
                tag.TagID,
                $"Tag '{tag.Name}' deleted",
                null
            );

            return Ok(new { message = $"Tag '{tag.Name}' deleted successfully." });
        }

    }
}
