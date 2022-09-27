namespace Timezones.Business.Services.Users
{
    using global::Timezones.Business.Services.Users.Models;
    using global::Timezones.Business.Utils.Pagination;

    public interface IUserService
    {
        Task<string> LoginAsync(UserAccountDTO userAccountDTO);

        Task ChangePasswordAsync(ChangePasswordDTO changePasswordDTO);

        Task<PaginatedResult<UserDTO>> GetListAsync(PaginationFilter paginationFilter, string email);

        Task<UserDTO> GetAsync(int id);

        Task<UserDTO> AddAsync(AddUserDTO createUserDTO);

        Task UpdateAsync(UpdateUserDTO updateUserDTO, int id);

        Task DeleteAsync(int id);

        Task<IEnumerable<string>> GetRolesAsync();
    }
}
