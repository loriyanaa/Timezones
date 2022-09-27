namespace Timezones.Data.Repositories
{
    using Timezones.Data.Models;

    public interface ITimezoneRepository
    {
        IQueryable<Timezone> GetAll();

        Task<Timezone> GetAsync(int id);

        Task<Timezone> AddAsync(Timezone timezone);

        void Delete(Timezone timezone);

        void DeleteRange(IQueryable<Timezone> timezones);

        Task SaveChangesAsync();
    }
}
