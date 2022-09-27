namespace Timezones.Business.Services.Users
{
    using Microsoft.AspNetCore.Http;
    using System.Security.Claims;

    public class UserProvider : IUserProvider
    {
        public UserProvider(IHttpContextAccessor httpContextAccessor)
        {
            string userIdClaim = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out int parsedUserId))
            {
                UserId = parsedUserId;
            }
           
            UserRole = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;
        }

        public string UserRole { get; }

        public int? UserId { get; }
    }
}
