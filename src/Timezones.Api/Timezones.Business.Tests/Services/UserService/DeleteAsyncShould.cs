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
    using Timezones.Common.Constants;
    using Timezones.Common.CustomExceptions;
    using Timezones.Data.Models;
    using Timezones.Data.Repositories;
    using Xunit;

    public class DeleteAsyncShould
    {
        private Mock<UserManager<User>> mockUserManager;
        private Mock<ITimezoneRepository> mockTimezoneRepository;

        public DeleteAsyncShould()
        {
            var mockStore = new Mock<IUserStore<User>>();
            this.mockUserManager = new Mock<UserManager<User>>(mockStore.Object, null, null, null, null, null, null, null, null);

            this.mockTimezoneRepository = new Mock<ITimezoneRepository>();
        }

        [Fact]
        public async Task DeleteUserIfFound()
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

            this.mockUserManager
                .Setup(x => x.IsInRoleAsync(
                    It.IsAny<User>(),
                    It.Is<string>(s => s == UserRoles.Admin)
                ))
                .ReturnsAsync(false);

            this.mockTimezoneRepository
                .Setup(x => x.GetAll())
                .Returns(Enumerable.Empty<Timezone>().AsQueryable().BuildMock().Object);

            this.mockUserManager
               .Setup(x => x.DeleteAsync(It.IsAny<User>()))
               .ReturnsAsync(IdentityResult.Success);

            var service = new UserService(
                this.mockUserManager.Object,
                null, null, null,
                this.mockTimezoneRepository.Object,
                null, null, null);

            // Act
            await service.DeleteAsync(1);

            // Assert
            this.mockUserManager.Verify(m => m.DeleteAsync(It.Is<User>(u => u == users.First())), Times.Once);
            this.mockTimezoneRepository.Verify(r => r.DeleteRange(It.IsAny<IQueryable<Timezone>>()), Times.Once);
            this.mockTimezoneRepository.Verify(r => r.SaveChangesAsync(), Times.Once);
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
                null, null, null, null, null, null, null);

            // Act
            Func<Task> action = async () => await service.DeleteAsync(2);

            // Assert
            await Assert.ThrowsAsync<DatabaseRecordNotFoundException>(action);
        }
    }
}
