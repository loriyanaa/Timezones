namespace Timezones.Business.Services.Users
{
    public interface IUserProvider
    {
        public string UserRole { get; }

        public int? UserId { get; }
    }
}
