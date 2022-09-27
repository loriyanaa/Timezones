namespace Timezones.Business.Tests.Services.UserService
{
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Identity;
    using MockQueryable.Moq;
    using Moq;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using Timezones.Business.Services.Users;
    using Timezones.Business.Services.Users.Models;
    using Timezones.Business.Utils.Jwt;
    using Timezones.Common.Constants;
    using Timezones.Common.CustomExceptions;
    using Timezones.Common.Settings;
    using Timezones.Data.Models;
    using Xunit;

    public class LoginAsyncShould
    {
        private Mock<JwtUtility> mockJwtUtility;
        private Mock<SignInManager<User>> mockSignInManager;
        private Mock<UserManager<User>> mockUserManager;

        public LoginAsyncShould()
        {
            var mockStore = new Mock<IUserStore<User>>();
            this.mockUserManager = new Mock<UserManager<User>>(mockStore.Object, null, null, null, null, null, null, null, null);

            var mockHttpContext = new Mock<HttpContext>();
            var mockHttpCntextAccessor = new Mock<IHttpContextAccessor>();
            mockHttpCntextAccessor.Setup(mock => mock.HttpContext).Returns(() => mockHttpContext.Object);
            var claimsFactory = new Mock<IUserClaimsPrincipalFactory<User>>();

            this.mockSignInManager = new Mock<SignInManager<User>>(
                this.mockUserManager.Object,
                mockHttpCntextAccessor.Object,
                claimsFactory.Object,
                null, null, null);

            var jwtSettings = new JwtSettings()
            {
                Issuer = "http://localhost",
                Secret = "H@McQfTjWnZr4u7x",
                ExpirationInDays = 1
            };
            this.mockJwtUtility = new Mock<JwtUtility>(jwtSettings);
        }

        [Fact]
        public async Task ReturnJwtTokenOnSuccessfulLogin()
        {
            // Arange
            this.mockSignInManager
                .Setup(x => x.PasswordSignInAsync(
                    It.Is<string>(s => s == "email@email.com"),
                    It.Is<string>(s => s == "password"),
                    It.IsAny<bool>(), It.IsAny<bool>()
                ))
                .ReturnsAsync(SignInResult.Success);

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
                .Setup(x => x.GetClaimsAsync(It.IsAny<User>()))
                .ReturnsAsync(new List<Claim>());

            var service = new UserService(
                this.mockUserManager.Object,
                null, null,
                this.mockSignInManager.Object,
                null, null,
                this.mockJwtUtility.Object,
                null);

            // Act
            var result = await service.LoginAsync(new UserAccountDTO
            {
                Email = "email@email.com",
                Password = "password"
            });

            // Assert
            Assert.False(string.IsNullOrEmpty(result));
        }

        [Fact]
        public async Task ThrowBadRequestExceptionIfUserDoesNotExist()
        {
            // Arange
            this.mockSignInManager
                .Setup(x => x.PasswordSignInAsync(
                    It.Is<string>(s => s == "email@email.com"),
                    It.Is<string>(s => s == "password"),
                    It.IsAny<bool>(), It.IsAny<bool>()
                ))
                .ReturnsAsync(SignInResult.Success);

            this.mockUserManager
               .Setup(x => x.Users)
               .Returns(Enumerable.Empty<User>().AsQueryable().BuildMock().Object);

            var service = new UserService(
                this.mockUserManager.Object,
                null, null,
                this.mockSignInManager.Object,
                null, null,
                mockJwtUtility.Object,
                null);

            // Act
            Func<Task> action = async () => await service.LoginAsync(new UserAccountDTO
            {
                Email = "email@email.com",
                Password = "password"
            });

            // Assert
            await Assert.ThrowsAsync<BadRequestException>(action);
        }

        [Fact]
        public async Task ThrowBadRequestExceptionIfSignInFails()
        {
            // Arange
            this.mockSignInManager
                .Setup(x => x.PasswordSignInAsync(
                    It.Is<string>(s => s == "email@email.com"),
                    It.Is<string>(s => s == "password"),
                    It.IsAny<bool>(), It.IsAny<bool>()
                ))
                .ReturnsAsync(SignInResult.Failed);

            var service = new UserService(
                this.mockUserManager.Object,
                null, null,
                this.mockSignInManager.Object,
                null, null,
                this.mockJwtUtility.Object,
                null);

            // Act
            Func<Task> action = async () => await service.LoginAsync(new UserAccountDTO
            {
                Email = "email@email.com",
                Password = "password"
            });

            // Assert
            await Assert.ThrowsAsync<BadRequestException>(action);
        }
    }
}
