namespace Timezones.Api.Extensions
{
    using Microsoft.Extensions.Options;
    using Timezones.Business.Services.Timezones;
    using Timezones.Business.Services.Users;
    using Timezones.Business.Utils.Jwt;
    using Timezones.Business.Utils.Pagination;
    using Timezones.Common.Settings;

    public static class ServiceExtensions
    {
        public static void AddServices(this IServiceCollection services)
        {
            services.AddTransient<ITimezoneService, TimezoneService>();
            services.AddTransient<IUserProvider, UserProvider>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IPaginationUtility, PaginationUtility>();
            services.AddTransient<IJwtUtility, JwtUtility>(implementationFactory =>
            {
                IOptionsSnapshot<JwtSettings> jwtSettings = implementationFactory.GetRequiredService<IOptionsSnapshot<JwtSettings>>();
                return new JwtUtility(jwtSettings.Value);
            });
        }
    }
}
