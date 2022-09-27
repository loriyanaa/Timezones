namespace Timezones.Data.Repositories
{
    using Microsoft.EntityFrameworkCore;
    using Timezones.Common.Constants;
    using Timezones.Common.CustomExceptions;
    using Timezones.Data.DataAccess;
    using Timezones.Data.Models;

    public class TimezoneRepository : ITimezoneRepository
    {
        private readonly DbContext context;

        public TimezoneRepository(TimezonesDbContext context)
        {
            this.context = context;
        }

        public IQueryable<Timezone> GetAll()
        {
            return this.context
                .Set<Timezone>()
                .AsQueryable();
        }

        public async Task<Timezone> GetAsync(int id)
        {
            Timezone? timezone = await this.GetAll()
                .FirstOrDefaultAsync(t => t.Id == id);

            if (timezone == null)
            {
                throw new DatabaseRecordNotFoundException(string.Format(ErrorMessages.RecordNotFound, $"Timezone with id {id}"));
            }

            return timezone;
        }

        public async Task<Timezone> AddAsync(Timezone timezone)
        {
            await this.context.AddAsync(timezone);

            return timezone;
        }

        public void Delete(Timezone timezone)
        {
            this.context.Remove(timezone);
        }

        public void DeleteRange(IQueryable<Timezone> timezones)
        {
            this.context.RemoveRange(timezones);
        }

        public async Task SaveChangesAsync()
        {
            await this.context.SaveChangesAsync();
        }
    }
}
