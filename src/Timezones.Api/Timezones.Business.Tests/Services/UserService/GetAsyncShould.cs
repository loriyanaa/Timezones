namespace Timezones.Business.Tests.Services.UserService
{
    using AutoMapper;
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

    public class GetAsyncShould
    {
        private Mock<UserManager<User>> mockUserManager;

        public GetAsyncShould()
        {
            var mockStore = new Mock<IUserStore<User>>();
            this.mockUserManager = new Mock<UserManager<User>>(mockStore.Object, null, null, null, null, null, null, null, null);
        }

        [Fact]
        public async Task MapUserIfFound()
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

            var mockMapper = new Mock<IMapper>();
            mockMapper.Setup(x => x.Map<User, UserDTO>(It.IsAny<User>()))
                .Returns(new UserDTO());

            var service = new UserService(
                this.mockUserManager.Object,
                null, null, null, null, null, null,
                mockMapper.Object);

            // Act
            UserDTO result = await service.GetAsync(1);

            // Assert
            this.mockUserManager.Verify(m => m.Users, Times.Once);
            mockMapper.Verify(m => m.Map<UserDTO>(users.First()), Times.Once);
        }

        [Fact]
        public async Task ThrowDatabaseRecordNotFoundExceptionIfUserIsNotFound()
        {
            // Arrange
            this.mockUserManager
               .Setup(x => x.Users)
               .Returns(Enumerable.Empty<User>().AsQueryable().BuildMock().Object);

            var service = new UserService(
                this.mockUserManager.Object,
                null, null, null, null, null, null,
                null);

            // Act
            Func<Task> action = async () => await service.GetAsync(1);

            // Assert
            await Assert.ThrowsAsync<DatabaseRecordNotFoundException>(action);
        }
    }
}
