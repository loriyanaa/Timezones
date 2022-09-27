namespace Timezones.Api.Extensions
{
    using Microsoft.AspNetCore.Authentication.JwtBearer;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.IdentityModel.Tokens;
    using System;
    using System.Linq;
    using System.Security.Claims;
    using System.Text;
    using System.Threading.Tasks;
    using Timezones.Common.Constants;
    using Timezones.Common.CustomExceptions;
    using Timezones.Common.Settings;
    using Timezones.Data.Models;

    public static class AuthExtensions
    {
        public static IServiceCollection AddAuth(
            this IServiceCollection services,
            JwtSettings jwtSettings)
        {
            services
                .AddAuthorization()
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = true;
                    options.Events = new JwtBearerEvents
                    {
                        OnTokenValidated = async context =>
                        {
                            await ValidateTokenAsync(context);
                        },
                    };
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidIssuer = jwtSettings.Issuer,
                        ValidateIssuer = true,
                        ValidAudience = jwtSettings.Issuer,
                        ValidateAudience = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret)),
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };
                });

            return services;
        }

        public static IApplicationBuilder UseAuth(this IApplicationBuilder builder)
        {
            builder.UseAuthentication();
            builder.UseAuthorization();

            return builder;
        }

        private static async Task ValidateTokenAsync(TokenValidatedContext context)
        {
            Claim? identifierClaim = context.Principal?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (identifierClaim == null)
            {
                context.Fail(ErrorMessages.Unauthorized);
                return;
            }

            UserManager<User> userManager = context.HttpContext.RequestServices.GetRequiredService<UserManager<User>>();
            User? user = userManager.Users.SingleOrDefault(u => u.Id == int.Parse(identifierClaim.Value));
            if (user == null)
            {
                context.Fail(ErrorMessages.Unauthorized);
                return;
            }

            Claim? mustChangePasswordClaim = (await userManager.GetClaimsAsync(user)).FirstOrDefault(c => c.Type == CustomClaims.MustChangePasswordClaimType);
            if (mustChangePasswordClaim != null)
            {
                throw new UnauthorizedException(ErrorMessages.InactiveAccount);
            }

            Claim? roleClaim = context.Principal?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
            if (roleClaim == null || !(await userManager.IsInRoleAsync(user, roleClaim.Value)))
            {
                context.Fail(ErrorMessages.Unauthorized);
            }
        }
    }
}
