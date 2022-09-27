namespace Timezones.Business.Utils.Jwt
{
    using System.Security.Claims;
    using Timezones.Data.Models;

    public interface IJwtUtility
    {
        string GenerateJwt(User user, IEnumerable<string> roles, List<Claim> claims);
    }
}
