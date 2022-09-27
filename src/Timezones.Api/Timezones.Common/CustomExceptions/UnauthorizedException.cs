namespace Timezones.Common.CustomExceptions
{
    using System.Net;

    public class UnauthorizedException : BusinessException
    {
        public UnauthorizedException(string exceptionMessage)
            : base(exceptionMessage)
        {
        }

        public override HttpStatusCode Status => HttpStatusCode.Unauthorized;
    }
}
