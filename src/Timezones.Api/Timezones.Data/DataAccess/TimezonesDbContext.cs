namespace Timezones.Data.DataAccess
{
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore;
    using Timezones.Data.Models;

    public class TimezonesDbContext : IdentityDbContext<User, Role, int, IdentityUserClaim<int>,
        UserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public TimezonesDbContext(DbContextOptions<TimezonesDbContext> options)
            : base(options)
        {
        }

        public DbSet<Timezone> Timezones { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserRole>()
                .HasOne(e => e.User)
                .WithMany(e => e.UserRoles)
                .HasForeignKey(e => e.UserId);

            builder.Entity<UserRole>()
                .HasOne(e => e.Role)
                .WithMany(e => e.UserRoles)
                .HasForeignKey(e => e.RoleId);

            builder.Seed();
        }
    }
}
