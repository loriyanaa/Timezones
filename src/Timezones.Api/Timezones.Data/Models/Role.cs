namespace Timezones.Data.Models
{
    using Microsoft.AspNetCore.Identity;

    public class Role : IdentityRole<int>
    {
        public virtual ICollection<UserRole> UserRoles { get; set; }
    }
}
