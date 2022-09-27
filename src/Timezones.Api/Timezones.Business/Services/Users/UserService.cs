namespace Timezones.Business.Services.Users
{
    using AutoMapper;
    using global::Timezones.Business.Services.Users.Models;
    using global::Timezones.Business.Utils.Jwt;
    using global::Timezones.Business.Utils.Pagination;
    using global::Timezones.Common.Constants;
    using global::Timezones.Common.CustomExceptions;
    using global::Timezones.Data.Models;
    using global::Timezones.Data.Repositories;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using System.Security.Claims;

    public class UserService : IUserService
    {
        private readonly UserManager<User> userManager;
        private readonly IUserProvider userProvider;
        private readonly RoleManager<Role> roleManager;
        private readonly SignInManager<User> signInManager;
        private readonly ITimezoneRepository timezoneRepository;
        private readonly IPaginationUtility paginationUtility;
        private readonly IJwtUtility jwtUtility;
        private readonly IMapper mapper;

        public UserService(
            UserManager<User> userManager,
            IUserProvider userProvider,
            RoleManager<Role> roleManager,
            SignInManager<User> signInManager,
            ITimezoneRepository timezoneRepository,
            IPaginationUtility paginationUtility,
            IJwtUtility jwtUtility,
            IMapper mapper)
        {
            this.userManager = userManager;
            this.userProvider = userProvider;
            this.roleManager = roleManager;
            this.signInManager = signInManager;
            this.timezoneRepository = timezoneRepository;
            this.paginationUtility = paginationUtility;
            this.jwtUtility = jwtUtility;
            this.mapper = mapper;
        }

        public async Task<string> LoginAsync(UserAccountDTO userAccountDTO)
        {
            SignInResult result = await this.signInManager
                .PasswordSignInAsync(userAccountDTO.Email, userAccountDTO.Password, false, false);

            if (!result.Succeeded)
            {
                throw new BadRequestException(ErrorMessages.InvalidLoginCredentials);
            }

            User? user = await this.userManager.Users
                .Include(u => u.UserRoles)
                .SingleOrDefaultAsync(u => u.Email == userAccountDTO.Email);

            if (user == null)
            {
                throw new BadRequestException(ErrorMessages.InvalidLoginCredentials);
            }

            List<Claim> claims = (await this.userManager.GetClaimsAsync(user)).ToList();

            string token = this.jwtUtility.GenerateJwt(user, user.UserRoles.Select(r => r.Role.Name), claims);

            return token;
        }

        public async Task ChangePasswordAsync(ChangePasswordDTO changePasswordDTO)
        {
            User? user = await this.userManager.FindByEmailAsync(changePasswordDTO.Email);

            if (user == null)
            {
                throw new BadRequestException(ErrorMessages.InvalidLoginCredentials);
            }

            if (changePasswordDTO.CurrentPassword == changePasswordDTO.NewPassword)
            {
                throw new BadRequestException(ErrorMessages.NewPasswordShouldBeDifferent);
            }

            IdentityResult result = await this.userManager.ChangePasswordAsync(user, changePasswordDTO.CurrentPassword, changePasswordDTO.NewPassword);

            if (!result.Succeeded)
            {
                throw new BadRequestException(result?.Errors.FirstOrDefault()?.Description);
            }

            Claim? changePasswordClaim = (await this.userManager
                .GetClaimsAsync(user))
                .FirstOrDefault(c => c.Type == CustomClaims.MustChangePasswordClaimType);

            if (changePasswordClaim != null)
            {
                await this.userManager.RemoveClaimAsync(user, changePasswordClaim);
            }
        }

        public async Task<PaginatedResult<UserDTO>> GetListAsync(PaginationFilter paginationFilter, string email)
        {
            IQueryable<User> users = this.userManager.Users
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role);

            if (!string.IsNullOrWhiteSpace(email))
            {
                users = users.Where(t => t.Email.ToLower().Contains(email.ToLower()));
            }

            PaginatedResult<UserDTO> result = await this.paginationUtility
                .GetPaginatedResultAsync<User, UserDTO>(users, paginationFilter.PageIndex, paginationFilter.PageSize);

            return result;
        }

        public async Task<UserDTO> GetAsync(int id)
        {
            User? user = await this.userManager.Users
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                throw new DatabaseRecordNotFoundException(string.Format(ErrorMessages.RecordNotFound, $"User with ID {id}"));
            }

            return this.mapper.Map<UserDTO>(user);
        }

        public async Task<UserDTO> AddAsync(AddUserDTO addUserDTO)
        {
            Role? userRole = await this.roleManager.FindByNameAsync(addUserDTO.RoleName);
            if (userRole == null)
            {
                throw new BadRequestException(ErrorMessages.InvalidUserRole);
            }

            User newUser = this.mapper.Map<User>(addUserDTO);
            IdentityResult result = await this.userManager.CreateAsync(newUser, addUserDTO.Password);
            if (!result.Succeeded)
            {
                throw new BadRequestException(result.Errors.First().Description);
            }

            result = await this.userManager.AddToRoleAsync(newUser, userRole.Name);
            if (!result.Succeeded)
            {
                throw new BadRequestException(result.Errors.First().Description);
            }

            if (this.userProvider.UserId != null)
            {
                var mustChangePasswordClaim = new Claim(CustomClaims.MustChangePasswordClaimType, CustomClaims.MustChangePasswordClaimValue);
                result = await this.userManager.AddClaimAsync(newUser, mustChangePasswordClaim);

                if (!result.Succeeded)
                {
                    throw new BadRequestException(result.Errors.First().Description);
                }
            }

            return this.mapper.Map<UserDTO>(newUser);
        }

        public async Task UpdateAsync(UpdateUserDTO userDTO, int id)
        {
            User? user = await this.userManager.Users
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                throw new DatabaseRecordNotFoundException(string.Format(ErrorMessages.RecordNotFound, $"User with ID {id}"));
            }

            Role role = await this.roleManager.FindByNameAsync(userDTO.RoleName);
            if (role == null)
            {
                throw new BadRequestException(ErrorMessages.InvalidUserRole);
            }

            bool emailTaken = await this.userManager.Users.AnyAsync(u => u.Id != id && u.Email == userDTO.Email);
            if (emailTaken)
            {
                throw new BadRequestException(ErrorMessages.UserAlreadyExists);
            }

            IdentityResult result = await this.userManager.SetUserNameAsync(user, userDTO.Email);
            if (!result.Succeeded)
            {
                throw new BadRequestException(result.Errors.First().Description);
            }

            result = await this.userManager.SetEmailAsync(user, userDTO.Email);
            if (!result.Succeeded)
            {
                throw new BadRequestException(result.Errors.First().Description);
            }

            if (!await this.userManager.IsInRoleAsync(user, userDTO.RoleName))
            {
                bool isUserAdmin = await this.userManager.IsInRoleAsync(user, UserRoles.Admin);
                if (isUserAdmin && (await this.userManager.GetUsersInRoleAsync(UserRoles.Admin)).Count == 1)
                {
                    throw new BadRequestException(ErrorMessages.LastAdminsRoleCannotBeChanged);
                }

                if (user.UserRoles.Any())
                {
                    result = await this.userManager.RemoveFromRoleAsync(user, user.UserRoles.FirstOrDefault()?.Role.Name);
                    if (!result.Succeeded)
                    {
                        throw new BadRequestException(result.Errors.First().Description);
                    }
                }
                
                result = await this.userManager.AddToRoleAsync(user, userDTO.RoleName);
                if (!result.Succeeded)
                {
                    throw new BadRequestException(result.Errors.First().Description);
                }
            }
        }

        public async Task DeleteAsync(int id)
        {
            User? user = await this.userManager.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                throw new DatabaseRecordNotFoundException(string.Format(ErrorMessages.RecordNotFound, $"User with ID {id}"));
            }

            bool isUserAdmin = await this.userManager.IsInRoleAsync(user, UserRoles.Admin);

            if (isUserAdmin && (await this.userManager.GetUsersInRoleAsync(UserRoles.Admin)).Count == 1)
            {
                throw new BadRequestException(ErrorMessages.LastAdminCannotBeDeleted);
            }

            IQueryable<Timezone> userTimezones = this.timezoneRepository.GetAll().Where(t => t.CreatorId == id);
            this.timezoneRepository.DeleteRange(userTimezones);

            IdentityResult result = await this.userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                throw new BadRequestException(result.Errors.First().Description);
            }

            await this.timezoneRepository.SaveChangesAsync();
        }

        public async Task<IEnumerable<string>> GetRolesAsync()
        {
            IEnumerable<string> roles = await this.roleManager.Roles.Select(r => r.Name).ToListAsync();

            return roles;
        }
    }
}
