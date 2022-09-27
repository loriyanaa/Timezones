namespace Timezones.Common.CustomExceptions
{
    using System.Net;

    public class BadRequestException : BusinessException
    {
        public BadRequestException(string exceptionMessage)
            : base(exceptionMessage)
        {
        }

        public override HttpStatusCode Status => HttpStatusCode.BadRequest;
    }
}
