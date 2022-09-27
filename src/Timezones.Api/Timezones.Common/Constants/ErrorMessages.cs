namespace Timezones.Common.Constants
{
    public class ErrorMessages
    {
        public const string GenericError = "Something went wrong. Please try again later.";
        public const string Unauthorized = "Authentication failed.";
        public const string InactiveAccount = "Account not activated. Change your password to activate it.";
        public const string Forbidden = "You are not authorized to access this resource.";
        public const string RecordNotFound = "{0} was not found.";
        public const string UserIdNotFound = "Unable to retrieve user id.";
        public const string InvalidUserRole = "Invalid user role. Valid user roles are 'User' and 'Admin'.";
        public const string InvalidLoginCredentials = "Invalid login credentials.";
        public const string NewPasswordShouldBeDifferent = "New password should be different than current password.";
        public const string LastAdminCannotBeDeleted = "Last admin account cannot be deleted.";
        public const string LastAdminsRoleCannotBeChanged = "Last admin's role cannot be changed.";
        public const string UserAlreadyExists = "User with this email already exists.";
        public const string InvalidOffsetFormat = "Offset should be valid. (e.g. +02:00)";
    }
}
