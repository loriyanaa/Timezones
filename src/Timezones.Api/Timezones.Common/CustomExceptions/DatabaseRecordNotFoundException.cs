namespace Timezones.Common.CustomExceptions
{
    using System.Net;

    public class DatabaseRecordNotFoundException : BusinessException
    {
        public DatabaseRecordNotFoundException(string exceptionMessage)
            : base(exceptionMessage)
        {
        }

        public override HttpStatusCode Status => HttpStatusCode.NotFound;
    }
}
