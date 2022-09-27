namespace Timezones.Business.Utils.Jwt
{
    using Microsoft.IdentityModel.Tokens;
    using System.IdentityModel.Tokens.Jwt;
    using System.Security.Claims;
    using System.Text;
    using Timezones.Common.Settings;
    using Timezones.Data.Models;

    public class JwtUtility : IJwtUtility
    {
        private readonly JwtSettings jwtSettings;

        public JwtUtility(JwtSettings jwtSettings)
        {
            this.jwtSettings = jwtSettings;
        }

        public string GenerateJwt(User user, IEnumerable<string> roles, List<Claim> claims)
        {
            claims.AddRange(new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email.ToString())
            });

            IEnumerable<Claim> roleClaims = roles.Select(r => new Claim(ClaimTypes.Role, r));
            claims.AddRange(roleClaims);

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this.jwtSettings.Secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            DateTime expires = DateTime.Now.AddDays(Convert.ToDouble(this.jwtSettings.ExpirationInDays));

            var token = new JwtSecurityToken(
               issuer: this.jwtSettings.Issuer,
               audience: this.jwtSettings.Issuer,
               claims,
               expires: expires,
               signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
