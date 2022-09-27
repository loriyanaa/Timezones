namespace Timezones.Data.DataAccess
{
    using Microsoft.EntityFrameworkCore;
    using Timezones.Data.Models;

    public static class ModelBuilderExtensions
    {
        public static void Seed(this ModelBuilder modelBuilder)
        {
            var adminRoleId = 1;
            var userRoleId = 2;

            modelBuilder.Entity<Role>().HasData(
                new Role
                {
                    Id = adminRoleId,
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                },
                new Role
                {
                    Id = userRoleId,
                    Name = "User",
                    NormalizedName = "USER"
                });

            var adminId = 1;

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = adminId,
                    UserName = "admin@admin.com",
                    NormalizedUserName = "ADMIN@ADMIN.COM",
                    Email = "admin@admin.com",
                    NormalizedEmail = "ADMIN@ADMIN.COM",
                    PasswordHash = "AQAAAAEAACcQAAAAEHOxw/vegB+EwZEl5ojrgj3x9ST8wrZbOmA2PI+CGodv2xhnNytfP0rSQRI84Un9IA==",
                    SecurityStamp = Guid.NewGuid().ToString()
                });

            modelBuilder.Entity<UserRole>().HasData(
                new UserRole
                {
                    RoleId = adminRoleId,
                    UserId = adminId
                });
        }
    }
}
