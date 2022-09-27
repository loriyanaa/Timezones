namespace Timezones.Common.CustomExceptions
{
    using System.Net;

    public abstract class BusinessException : Exception
    {
        public BusinessException(string message) : base(message)
        {
        }

        public abstract HttpStatusCode Status { get; }

        public BusinessExceptionError Error => new BusinessExceptionError { Message = Message };
    }
}
