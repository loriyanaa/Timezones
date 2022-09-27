namespace Timezones.Business.Tests.Services.UserService
{
    using Microsoft.AspNetCore.Identity;
    using MockQueryable.Moq;
    using Moq;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Timezones.Business.Services.Users;
    using Timezones.Common.Constants;
    using Timezones.Data.Models;
    using Xunit;

    public class GetRolesAsyncShould
    {
        private Mock<RoleManager<Role>> mockRoleManager;

        public GetRolesAsyncShould()
        {
            var roleStore = new Mock<IRoleStore<Role>>();
            this.mockRoleManager = new Mock<RoleManager<Role>>(roleStore.Object, null, null, null, null);
        }

        [Fact]
        public async Task ReturnUserRoles()
        {
            // Arrange
            var roles = new List<Role> 
            {
                new Role
                {
                    Name = UserRoles.User
                },
                new Role
                {
                    Name = UserRoles.Admin
                }
            };

            this.mockRoleManager
               .Setup(x => x.Roles)
               .Returns(roles.AsQueryable().BuildMock().Object);

            var service = new UserService(
                null, null, 
                this.mockRoleManager.Object,
                null, null, null, null, null);

            // Act
            IEnumerable<string> result = await service.GetRolesAsync();

            // Assert
            this.mockRoleManager.Verify(m => m.Roles, Times.Once);
            Assert.Equal(roles.Count, result.Count());
        }
    }
}
