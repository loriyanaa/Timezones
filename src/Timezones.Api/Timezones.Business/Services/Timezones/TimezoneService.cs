namespace Timezones.Business.Services.Timezones
{
    using AutoMapper;
    using global::Timezones.Business.Services.Timezones.Models;
    using global::Timezones.Business.Services.Users;
    using global::Timezones.Business.Utils.Pagination;
    using global::Timezones.Common.Constants;
    using global::Timezones.Common.CustomExceptions;
    using global::Timezones.Data.Models;
    using global::Timezones.Data.Repositories;

    public class TimezoneService : ITimezoneService
    {
        private readonly ITimezoneRepository timezoneRepository;
        private readonly IPaginationUtility paginationUtility;
        private readonly IUserProvider userProvider;
        private readonly IMapper mapper;

        public TimezoneService(
            ITimezoneRepository timezoneRepository,
            IPaginationUtility paginationUtility,
            IUserProvider userProvider,
            IMapper mapper)
        {
            this.timezoneRepository = timezoneRepository;
            this.paginationUtility = paginationUtility;
            this.userProvider = userProvider;
            this.mapper = mapper;
        }

        public async Task<PaginatedResult<TimezoneDTO>> GetListAsync(PaginationFilter paginationFilter, string name)
        {
            if (this.userProvider.UserId == null)
            {
                throw new UnauthorizedException(ErrorMessages.UserIdNotFound);
            }

            IQueryable<Timezone> timezones = this.timezoneRepository.GetAll();   

            if (!string.IsNullOrWhiteSpace(name))
            {
                timezones = timezones.Where(t => t.Name.ToLower().Contains(name.ToLower()));
            }

            if (this.userProvider.UserRole != UserRoles.Admin)
            {
                timezones = timezones.Where(t => t.CreatorId == this.userProvider.UserId);
            }

            PaginatedResult<TimezoneDTO> result = await this.paginationUtility
                .GetPaginatedResultAsync<Timezone, TimezoneDTO>(timezones, paginationFilter.PageIndex, paginationFilter.PageSize);

            return result;
        }

        public async Task<TimezoneDTO> GetAsync(int id)
        {
            Timezone timezone = await this.timezoneRepository.GetAsync(id);

            if (this.userProvider.UserRole != UserRoles.Admin && timezone.CreatorId != this.userProvider.UserId)
            {
                throw new ForbiddenAccessException(ErrorMessages.Forbidden);
            }

            return this.mapper.Map<TimezoneDTO>(timezone);
        }

        public async Task<TimezoneDTO> AddAsync(AddTimezoneDTO addTimezoneDTO)
        {
            if (this.userProvider.UserId == null)
            {
                throw new UnauthorizedException(ErrorMessages.UserIdNotFound);
            }

            Timezone timezone = this.mapper.Map<Timezone>(addTimezoneDTO);
            timezone.CreatorId = (int)this.userProvider.UserId;

            await this.timezoneRepository.AddAsync(timezone);
            await this.timezoneRepository.SaveChangesAsync();

            return this.mapper.Map<TimezoneDTO>(timezone);
        }

        public async Task UpdateAsync(UpdateTimezoneDTO updateTimezoneDTO, int id)
        {
            if (this.userProvider.UserId == null)
            {
                throw new UnauthorizedException(ErrorMessages.UserIdNotFound);
            }

            Timezone timezone = await this.timezoneRepository.GetAsync(id);

            if (this.userProvider.UserRole != UserRoles.Admin && timezone.CreatorId != this.userProvider.UserId)
            {
                throw new ForbiddenAccessException(ErrorMessages.Forbidden);
            }

            this.mapper.Map(updateTimezoneDTO, timezone);
            await this.timezoneRepository.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            if (this.userProvider.UserId == null)
            {
                throw new UnauthorizedException(ErrorMessages.UserIdNotFound);
            }

            Timezone timezone = await this.timezoneRepository.GetAsync(id);

            if (this.userProvider.UserRole != UserRoles.Admin && timezone.CreatorId != this.userProvider.UserId)
            {
                throw new ForbiddenAccessException(ErrorMessages.Forbidden);
            }

            this.timezoneRepository.Delete(timezone);
            await this.timezoneRepository.SaveChangesAsync();
        }
    }
}
