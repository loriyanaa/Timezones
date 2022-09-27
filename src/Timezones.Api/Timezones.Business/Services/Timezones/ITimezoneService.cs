namespace Timezones.Business.Services.Timezones
{
    using global::Timezones.Business.Services.Timezones.Models;
    using global::Timezones.Business.Utils.Pagination;

    public interface ITimezoneService
    {
        Task<PaginatedResult<TimezoneDTO>> GetListAsync(PaginationFilter paginationFilter, string name);

        Task<TimezoneDTO> GetAsync(int id);

        Task<TimezoneDTO> AddAsync(AddTimezoneDTO addTimezoneDTO);

        Task UpdateAsync(UpdateTimezoneDTO updateTimezoneDTO, int id);

        Task DeleteAsync(int id);
    }
}
