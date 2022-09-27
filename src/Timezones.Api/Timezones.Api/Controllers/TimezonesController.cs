namespace Timezones.Api.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Cors;
    using Microsoft.AspNetCore.Mvc;
    using Timezones.Business.Services.Timezones;
    using Timezones.Business.Services.Timezones.Models;
    using Timezones.Business.Utils.Pagination;
    using Timezones.Common.CustomExceptions;

    [Produces("application/json")]
    [Route("api/[controller]")]
    [EnableCors("CorsPolicy")]
    [ApiController, Authorize]
    public class TimezonesController : ControllerBase
    {
        private readonly ITimezoneService timezoneService;

        public TimezonesController(ITimezoneService timezoneService)
        {
            this.timezoneService = timezoneService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(PaginatedResult<TimezoneDTO>))]
        public async Task<IActionResult> GetList([FromQuery] PaginationFilter queryFilter, [FromQuery] string? name)
        {
            PaginatedResult<TimezoneDTO> result = await this.timezoneService.GetListAsync(queryFilter, name);

            return this.Ok(result);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(TimezoneDTO))]
        [ProducesResponseType(StatusCodes.Status403Forbidden, Type = typeof(BusinessExceptionError))]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(BusinessExceptionError))]
        public async Task<IActionResult> Get(int id)
        {
            TimezoneDTO result = await this.timezoneService.GetAsync(id);

            return this.Ok(result);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(TimezoneDTO))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BusinessExceptionError))]
        public async Task<IActionResult> Add([FromBody] AddTimezoneDTO timezone)
        {
            TimezoneDTO result = await this.timezoneService.AddAsync(timezone);

            return this.CreatedAtAction(nameof(this.Get), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BusinessExceptionError))]
        [ProducesResponseType(StatusCodes.Status403Forbidden, Type = typeof(BusinessExceptionError))]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(BusinessExceptionError))]
        public async Task<IActionResult> Update([FromBody] UpdateTimezoneDTO timezone, int id)
        {
            await this.timezoneService.UpdateAsync(timezone, id);

            return this.NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status403Forbidden, Type = typeof(BusinessExceptionError))]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(BusinessExceptionError))]
        public async Task<IActionResult> Delete(int id)
        {
            await this.timezoneService.DeleteAsync(id);

            return this.NoContent();
        }
    }
}
