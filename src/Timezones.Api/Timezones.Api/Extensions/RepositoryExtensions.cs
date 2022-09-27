namespace Timezones.Api.Extensions
{
    using Timezones.Data.Repositories;

    public static class RepositoryExtensions
    {
        public static void AddRepositories(this IServiceCollection services)
        {
            services.AddTransient<ITimezoneRepository, TimezoneRepository>();
        }
    }
}
