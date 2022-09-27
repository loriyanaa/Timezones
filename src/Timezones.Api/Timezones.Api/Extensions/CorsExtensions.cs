namespace Timezones.Api.Extensions
{
    using Microsoft.Extensions.DependencyInjection;
    using System;

    public static class CorsExtensions
    {
        public static void AddCorsPolicy(this IServiceCollection services, string name, string origins)
        {
            string[] originsArray = Array.ConvertAll(origins.Split(","), origin => origin.Trim());

            services.AddCors(options => options.AddPolicy(name, builder =>
            {
                builder
                    .WithOrigins(originsArray)
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            }));
        }
    }
}
