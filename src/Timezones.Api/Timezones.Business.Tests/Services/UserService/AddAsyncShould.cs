namespace Timezones.Business.Tests.Services.UserService
{
    using AutoMapper;
    using Microsoft.AspNetCore.Identity;
    using Moq;
    using System;
    using System.Threading.Tasks;
    using Timezones.Business.Services.Users;
    using Timezones.Business.Services.Users.Models;
    using Timezones.Common.Constants;
    using Timezones.Common.CustomExceptions;
    using Timezones.Data.Models;
    using Xunit;

    public class AddAsyncShould
    {
        private Mock<UserManager<User>> mockUserManager;
        private Mock<RoleManager<Role>> mockRoleManager;
        private Mock<IUserProvider> mockUserProvider;

        public AddAsyncShould()
        {
            var mockStore = new Mock<IUserStore<User>>();
            this.mockUserManager = new Mock<UserManager<User>>(mockStore.Object, null, null, null, null, null, null, null, null);

            var roleStore = new Mock<IRoleStore<Role>>();
            this.mockRoleManager = new Mock<RoleManager<Role>>(roleStore.Object, null, null, null, null);

            this.mockUserProvider = new Mock<IUserProvider>();
        }

        [Fact]
        public async Task AddUserIfRoleIsValid()
        {
            // Arrange
            this.mockUserManager
                .Setup(x => x.CreateAsync(
                    It.IsAny<User>(),
                    It.Is<string>(s => s == "password")
                ))
                .ReturnsAsync(IdentityResult.Success);

            this.mockUserManager
               .Setup(x => x.AddToRoleAsync(
                   It.IsAny<User>(),
                   It.Is<string>(s => s == UserRoles.User)
               ))
               .ReturnsAsync(IdentityResult.Success);

            this.mockRoleManager
               .Setup(x => x.FindByNameAsync(It.Is<string>(s => s == UserRoles.User)))
               .ReturnsAsync(new Role { Name = UserRoles.User });

            var mockMapper = new Mock<IMapper>();
            mockMapper.Setup(x => x.Map<AddUserDTO, User>(It.IsAny<AddUserDTO>()))
                .Returns(new User());
            mockMapper.Setup(x => x.Map<User, UserDTO>(It.IsAny<User>()))
                .Returns(new UserDTO());

            var service = new UserService(
                this.mockUserManager.Object,
                this.mockUserProvider.Object,
                this.mockRoleManager.Object,
                null, null, null, null,
                mockMapper.Object);

            var addUserDTO = new AddUserDTO
            {
                Email = "email@email.com",
                Password = "password",
                RoleName = UserRoles.User
            };

            // Act
            await service.AddAsync(addUserDTO);

            // Assert
            this.mockUserManager.Verify(m => m.CreateAsync(It.IsAny<User>(), It.Is<string>(s => s == "password")), Times.Once);
            mockMapper.Verify(m => m.Map<User>(addUserDTO), Times.Once);
            mockMapper.Verify(m => m.Map<UserDTO>(It.IsAny<User>()), Times.Once);
        }

        [Fact]
        public async Task ThrowBadRequestExceptionIfRoleDoesNotExist()
        {
            // Arrange
            this.mockRoleManager
               .Setup(x => x.FindByNameAsync(It.Is<string>(s => s == UserRoles.User)))
               .ReturnsAsync((Role)null);

            var service = new UserService(
                this.mockUserManager.Object,
                this.mockUserProvider.Object,
                this.mockRoleManager.Object,
                null, null, null, null, null);

            var addUserDTO = new AddUserDTO
            {
                Email = "email@email.com",
                Password = "password",
                RoleName = UserRoles.User
            };

            // Act
            Func<Task> action = async () => await service.AddAsync(addUserDTO);

            // Assert
            await Assert.ThrowsAsync<BadRequestException>(action);
        }
    }
}
