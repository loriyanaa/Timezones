namespace Timezones.Data.Models
{
    using Microsoft.AspNetCore.Identity;

    public class User : IdentityUser<int>
    {
        public ICollection<UserRole> UserRoles { get; set; }

        public ICollection<Timezone> Timezones { get; set; }
    }
}
