namespace Timezones.Api.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Cors;
    using Microsoft.AspNetCore.Mvc;
    using Timezones.Business.Services.Users;
    using Timezones.Business.Services.Users.Models;
    using Timezones.Business.Utils.Pagination;
    using Timezones.Common.Constants;
    using Timezones.Common.CustomExceptions;

    [Produces("application/json")]
    [Route("api/[controller]")]
    [EnableCors("CorsPolicy")]
    [ApiController, Authorize(Roles = UserRoles.Admin)]
    public class UsersController : ControllerBase
    {
        private readonly IUserService userService;

        public UsersController(IUserService userService)
        {
            this.userService = userService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(PaginatedResult<UserDTO>))]
        public async Task<IActionResult> GetList([FromQuery] PaginationFilter paginationFilter, [FromQuery] string? email)
        {
            PaginatedResult<UserDTO> result = await this.userService.GetListAsync(paginationFilter, email);

            return this.Ok(result);
        }

        [HttpGet("roles")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<string>))]
        public async Task<IActionResult> GetRoles()
        {
            IEnumerable<string> result = await this.userService.GetRolesAsync();

            return this.Ok(result);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UserDTO))]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(BusinessExceptionError))]
        public async Task<IActionResult> Get(int id)
        {
            UserDTO result = await this.userService.GetAsync(id);

            return this.Ok(result);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(UserDTO))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BusinessExceptionError))]
        public async Task<IActionResult> Add([FromBody] AddUserDTO user)
        {
            UserDTO result = await this.userService.AddAsync(user);

            return this.CreatedAtAction(nameof(this.Get), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BusinessExceptionError))]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(BusinessExceptionError))]
        public async Task<IActionResult> Update([FromBody] UpdateUserDTO user, int id)
        {
            await this.userService.UpdateAsync(user, id);

            return this.NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BusinessExceptionError))]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(BusinessExceptionError))]
        public async Task<IActionResult> Delete(int id)
        {
            await this.userService.DeleteAsync(id);

            return this.NoContent();
        }
    }
}
