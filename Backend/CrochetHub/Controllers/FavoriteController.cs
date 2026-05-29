using CrochetHub.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CrochetHub.Controllers
{
    [Authorize]
    public class FavoriteController : BaseApiController
    {
        private readonly IFavoriteService _favoriteService;

        public FavoriteController(IFavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }

        // GET api/favorite
        [HttpGet]
        public async Task<IActionResult> GetMyFavorites()
        {
            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var favorites = await _favoriteService.GetMyFavoritesAsync(userID.Value);
            return Ok(favorites);
        }

        // GET api/favorite/{patternID}/check
        [HttpGet("{patternID}/check")]
        public async Task<IActionResult> CheckIsFavorite(int patternID)
        {
            if (patternID <= 0)
                return BadRequest(new { message = "Invalid pattern ID." });

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var isFavorite = await _favoriteService.IsFavoriteAsync(userID.Value, patternID);
            return Ok(new { isFavorite });
        }

        // POST api/favorite/{patternID}
        [HttpPost("{patternID}")]
        public async Task<IActionResult> AddFavorite(int patternID)
        {
            if (patternID <= 0)
                return BadRequest(new { message = "Invalid pattern ID." });

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (success, message) = await _favoriteService.AddFavoriteAsync(userID.Value, patternID);
            if (!success)
                return message.Contains("not found")
                    ? NotFound(new { message })
                    : BadRequest(new { message });

            return Ok(new { message });
        }

        // DELETE api/favorite/{patternID}
        [HttpDelete("{patternID}")]
        public async Task<IActionResult> RemoveFavorite(int patternID)
        {
            if (patternID <= 0)
                return BadRequest(new { message = "Invalid pattern ID." });

            var userID = GetUserID();
            if (userID == null) return Unauthorized();

            var (success, message) = await _favoriteService.RemoveFavoriteAsync(userID.Value, patternID);
            if (!success)
                return message.Contains("not found")
                    ? NotFound(new { message })
                    : BadRequest(new { message });

            return Ok(new { message });
        }
    }
}
