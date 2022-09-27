namespace Timezones.Api.Filters
{
    using Microsoft.AspNetCore.Mvc.Filters;
    using Timezones.Common.CustomExceptions;

    public class ValidationFilter : IActionFilter
    {
        public void OnActionExecuted(ActionExecutedContext context)
        {
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                string error = context.ModelState.Values
                    .First(v => v.Errors.Count > 0).Errors
                    .Select(e => e.ErrorMessage)
                    .First();

                throw new BadRequestException(error);
            }
        }
    }
}
