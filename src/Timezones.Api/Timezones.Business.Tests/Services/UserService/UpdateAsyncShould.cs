namespace Timezones.Business.Tests.Services.UserService
{
    using Microsoft.AspNetCore.Identity;
    using MockQueryable.Moq;
    using Moq;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Timezones.Business.Services.Users;
    using Timezones.Business.Services.Users.Models;
    using Timezones.Common.Constants;
    using Timezones.Common.CustomExceptions;
    using Timezones.Data.Models;
    using Xunit;

    public class UpdateAsyncShould
    {
        private Mock<UserManager<User>> mockUserManager;
        private Mock<RoleManager<Role>> mockRoleManager;

        public UpdateAsyncShould()
        {
            var mockStore = new Mock<IUserStore<User>>();
            this.mockUserManager = new Mock<UserManager<User>>(mockStore.Object, null, null, null, null, null, null, null, null);

            var roleStore = new Mock<IRoleStore<Role>>();
            this.mockRoleManager = new Mock<RoleManager<Role>>(roleStore.Object, null, null, null, null);
        }

        [Fact]
        public async Task UpdateUserIfFound()
        {
            // Arrange
            var users = new List<User> { new User
            {
                Id = 1,
                UserName = "email@email.com",
                Email = "email@email.com",
                UserRoles = new List<UserRole> { new UserRole
                {
                    Role = new Role
                    {
                        Name = UserRoles.User
                    }
                }}
            }};

            this.mockUserManager
               .Setup(x => x.Users)
               .Returns(users.AsQueryable().BuildMock().Object);

            this.mockRoleManager
               .Setup(x => x.FindByNameAsync(It.Is<string>(s => s == UserRoles.User)))
               .ReturnsAsync(new Role { Name = UserRoles.User });

            this.mockUserManager
                .Setup(x => x.SetUserNameAsync(
                    It.IsAny<User>(),
                    It.Is<string>(s => s == "email@email.com")
                ))
                .ReturnsAsync(IdentityResult.Success);

            this.mockUserManager
                .Setup(x => x.SetEmailAsync(
                    It.IsAny<User>(),
                    It.Is<string>(s => s == "email@email.com")
                ))
                .ReturnsAsync(IdentityResult.Success);

            this.mockUserManager
               .Setup(x => x.IsInRoleAsync(
                   It.IsAny<User>(),
                   It.Is<string>(s => s == UserRoles.User)
               ))
               .ReturnsAsync(true);

            var service = new UserService(
                this.mockUserManager.Object,
                null,
                this.mockRoleManager.Object,
                null, null, null, null, null);

            var updateUserDTO = new UpdateUserDTO
            {
                Email = "email@email.com",
                RoleName = UserRoles.User
            };

            // Act
            await service.UpdateAsync(updateUserDTO, 1);

            // Assert
            mockUserManager.Verify(m => m.SetUserNameAsync(It.IsAny<User>(), It.Is<string>(s => s == updateUserDTO.Email)), Times.Once);
            mockUserManager.Verify(m => m.SetEmailAsync(It.IsAny<User>(), It.Is<string>(s => s == updateUserDTO.Email)), Times.Once);
        }

        [Fact]
        public async Task ThrowDatabaseRecordNotFoundExceptionIfUserIsNotFound()
        {
            // Arrange
            var users = new List<User> { new User
            {
                Id = 1,
                UserName = "email@email.com",
                Email = "email@email.com",
                UserRoles = new List<UserRole> { new UserRole
                {
                    Role = new Role
                    {
                        Name = UserRoles.User
                    }
                }}
            }};

            this.mockUserManager
               .Setup(x => x.Users)
               .Returns(users.AsQueryable().BuildMock().Object);

            var service = new UserService(
                this.mockUserManager.Object,
                null,
                this.mockRoleManager.Object,
                null, null, null, null, null);

            var updateUserDTO = new UpdateUserDTO
            {
                Email = "email@email.com",
                RoleName = UserRoles.User
            };

            // Act
            Func<Task> action = async () => await service.UpdateAsync(updateUserDTO, 2);

            // Assert
            await Assert.ThrowsAsync<DatabaseRecordNotFoundException>(action);
        }

        [Fact]
        public async Task ThrowBadRequestExceptionIfRoleIsNotValid()
        {
            // Arrange
            var users = new List<User> { new User
            {
                Id = 1,
                UserName = "email@email.com",
                Email = "email@email.com",
                UserRoles = new List<UserRole> { new UserRole
                {
                    Role = new Role
                    {
                        Name = UserRoles.User
                    }
                }}
            }};

            this.mockUserManager
               .Setup(x => x.Users)
               .Returns(users.AsQueryable().BuildMock().Object);

            this.mockRoleManager
               .Setup(x => x.FindByNameAsync(It.Is<string>(s => s == UserRoles.User)))
               .ReturnsAsync(new Role { Name = UserRoles.User });

            var service = new UserService(
                this.mockUserManager.Object,
                null,
                this.mockRoleManager.Object,
                null, null, null, null, null);

            var updateUserDTO = new UpdateUserDTO
            {
                Email = "email@email.com",
                RoleName = "Invalid role"
            };

            // Act
            Func<Task> action = async () => await service.UpdateAsync(updateUserDTO, 1);

            // Assert
            await Assert.ThrowsAsync<BadRequestException>(action);
        }
    }
}
