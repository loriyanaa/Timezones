namespace Timezones.Business.Tests.Services.TimezoneService
{
    using AutoMapper;
    using Moq;
    using System;
    using System.Threading.Tasks;
    using Timezones.Business.Services.Timezones;
    using Timezones.Business.Services.Timezones.Models;
    using Timezones.Business.Services.Users;
    using Timezones.Common.Constants;
    using Timezones.Common.CustomExceptions;
    using Timezones.Data.Models;
    using Timezones.Data.Repositories;
    using Xunit;

    public class GetAsyncShould
    {
        private Mock<ITimezoneRepository> mockTimezoneRepository;
        private Mock<IUserProvider> mockUserProvider;

        public GetAsyncShould()
        {
            this.mockTimezoneRepository = new Mock<ITimezoneRepository>();
            this.mockUserProvider = new Mock<IUserProvider>();
        }

        [Fact]
        public async Task MapTimezone()
        {
            // Arrange
            this.mockTimezoneRepository
               .Setup(x => x.GetAsync(It.IsAny<int>()))
               .ReturnsAsync(new Timezone());

            var mockMapper = new Mock<IMapper>();

            this.mockUserProvider.Setup(p => p.UserRole).Returns(UserRoles.Admin);

            var service = new TimezoneService(
                this.mockTimezoneRepository.Object,
                null,
                this.mockUserProvider.Object,
                mockMapper.Object);

            // Act
            TimezoneDTO result = await service.GetAsync(1);

            // Assert
            this.mockTimezoneRepository.Verify(m => m.GetAsync(1), Times.Once);
            mockMapper.Verify(m => m.Map<TimezoneDTO>(It.IsAny<Timezone>()), Times.Once);
        }

        [Fact]
        public async Task ThrowForbiddenAccessExceptionIfUserIsNotAdminAndCreatorOfTimezone()
        {
            // Arrange
            this.mockTimezoneRepository
               .Setup(x => x.GetAsync(It.IsAny<int>()))
               .ReturnsAsync(new Timezone { CreatorId = 1 });

            this.mockUserProvider.Setup(p => p.UserRole).Returns(UserRoles.User);
            this.mockUserProvider.Setup(p => p.UserId).Returns(2);

            var service = new TimezoneService(
                this.mockTimezoneRepository.Object,
                null,
                this.mockUserProvider.Object,
                null);

            // Act
            Func<Task> action = async () => await service.GetAsync(1);

            // Assert
            await Assert.ThrowsAsync<ForbiddenAccessException>(action);
        }
    }
}
