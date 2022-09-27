namespace Timezones.Api.Middlewares
{
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Logging;
    using System;
    using System.Net;
    using System.Text.Json;
    using System.Threading.Tasks;
    using Timezones.Common.Constants;
    using Timezones.Common.CustomExceptions;

    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate next;
        private readonly ILogger<ExceptionHandlingMiddleware> logger;

        public ExceptionHandlingMiddleware(
            RequestDelegate next,
            ILogger<ExceptionHandlingMiddleware> logger)
        {
            this.logger = logger;
            this.next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await this.next(httpContext);
            }
            catch (BusinessException ex)
            {
                httpContext.Response.StatusCode = (int)ex.Status;
                httpContext.Response.ContentType = "application/json";
                await httpContext.Response.WriteAsync(JsonSerializer.Serialize(
                    ex.Error,
                    new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }));

                this.logger.LogError(ex.ToString());
            }
            catch (Exception ex)
            {
                httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                await httpContext.Response.WriteAsJsonAsync(ErrorMessages.GenericError);

                this.logger.LogError(ex.ToString());
            }
        }
    }
}
