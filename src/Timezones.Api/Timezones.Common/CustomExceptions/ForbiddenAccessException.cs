namespace Timezones.Common.CustomExceptions
{
    using System.Net;

    public class ForbiddenAccessException : BusinessException
    {
        public ForbiddenAccessException(string exceptionMessage)
            : base(exceptionMessage)
        {
        }

        public override HttpStatusCode Status => HttpStatusCode.Forbidden;
    }
}
