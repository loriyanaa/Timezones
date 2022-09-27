namespace Timezones.Business.Tests.Services.UserService
{
    using Microsoft.AspNetCore.Identity;
    using Moq;
    using System;
    using System.Collections.Generic;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using Timezones.Business.Services.Users;
    using Timezones.Business.Services.Users.Models;
    using Timezones.Common.CustomExceptions;
    using Timezones.Data.Models;
    using Xunit;

    public class ChangePasswordAsyncShould
    {
        private Mock<UserManager<User>> mockUserManager;

        public ChangePasswordAsyncShould()
        {
            var mockStore = new Mock<IUserStore<User>>();
            this.mockUserManager = new Mock<UserManager<User>>(mockStore.Object, null, null, null, null, null, null, null, null);
        }

        [Fact]
        public async Task CallUserManagerChangePasswordIfUserExists()
        {
            // Arange
            this.mockUserManager
               .Setup(x => x.FindByEmailAsync(It.Is<string>(s => s == "email@email.com")))
               .ReturnsAsync(new User());

            this.mockUserManager
                .Setup(x => x.ChangePasswordAsync(
                    It.IsAny<User>(),
                    It.Is<string>(s => s == "password"),
                    It.Is<string>(s => s == "newPassword")
                ))
                .ReturnsAsync(IdentityResult.Success);

            this.mockUserManager
                .Setup(x => x.GetClaimsAsync(It.IsAny<User>()))
                .ReturnsAsync(new List<Claim>());

            var service = new UserService(
                this.mockUserManager.Object,
                null, null, null, null, null, null, null);

            // Act
            await service.ChangePasswordAsync(new ChangePasswordDTO
            {
                Email = "email@email.com",
                CurrentPassword = "password",
                NewPassword  = "newPassword"
            });

            // Assert
            this.mockUserManager.Verify(m => m.ChangePasswordAsync(
                It.IsAny<User>(),
                It.Is<string>(s => s == "password"),
                It.Is<string>(s => s == "newPassword")), Times.Once);
        }

        [Fact]
        public async Task ThrowBadRequestExceptionIfUserDoesNotExist()
        {
            // Arange
            this.mockUserManager
               .Setup(x => x.FindByEmailAsync(It.Is<string>(s => s == "email@email.com")))
               .ReturnsAsync((User)null);

            var service = new UserService(
                this.mockUserManager.Object,
                null, null, null, null, null, null, null);

            // Act
            Func<Task> action = async () => await service.ChangePasswordAsync(new ChangePasswordDTO
            {
                Email = "email@email.com",
                CurrentPassword = "password",
                NewPassword = "newPassword"
            });

            // Assert
            await Assert.ThrowsAsync<BadRequestException>(action);
        }

        [Fact]
        public async Task ThrowBadRequestExceptionIfPasswordChangeFails()
        {
            // Arange
            this.mockUserManager
               .Setup(x => x.FindByEmailAsync(It.Is<string>(s => s == "email@email.com")))
               .ReturnsAsync(new User());

            this.mockUserManager
                .Setup(x => x.ChangePasswordAsync(
                    It.IsAny<User>(),
                    It.Is<string>(s => s == "password"),
                    It.Is<string>(s => s == "newPassword")
                ))
                .ReturnsAsync(IdentityResult.Failed());

            var service = new UserService(
                this.mockUserManager.Object,
                null, null, null, null, null, null, null);

            // Act
            Func<Task> action = async () => await service.ChangePasswordAsync(new ChangePasswordDTO
            {
                Email = "email@email.com",
                CurrentPassword = "password",
                NewPassword = "newPassword"
            });

            // Assert
            await Assert.ThrowsAsync<BadRequestException>(action);
        }
    }
}
