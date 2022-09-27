namespace Timezones.Api.Controllers
{
    using Microsoft.AspNetCore.Cors;
    using Microsoft.AspNetCore.Mvc;
    using Timezones.Business.Services.Users;
    using Timezones.Business.Services.Users.Models;
    using Timezones.Common.Constants;
    using Timezones.Common.CustomExceptions;

    [Produces("application/json")]
    [Route("api/[controller]")]
    [EnableCors("CorsPolicy")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IUserService userService;

        public AccountController(IUserService userService)
        {
            this.userService = userService;
        }

        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BusinessExceptionError))]
        public async Task<IActionResult> Login([FromBody] UserAccountDTO account)
        {
            string token = await this.userService.LoginAsync(account);

            return this.Ok(token);
        }

        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BusinessExceptionError))]
        public async Task<IActionResult> Register([FromBody] UserAccountDTO account)
        {
            AddUserDTO addUserDTO = new AddUserDTO()
            {
                Email = account.Email,
                Password = account.Password,
                RoleName = UserRoles.User
            };

            await this.userService.AddAsync(addUserDTO);

            return this.NoContent();
        }

        [HttpPut("password")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BusinessExceptionError))]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO changePassword)
        {
            await this.userService.ChangePasswordAsync(changePassword);

            return this.NoContent();
        }
    }
}
