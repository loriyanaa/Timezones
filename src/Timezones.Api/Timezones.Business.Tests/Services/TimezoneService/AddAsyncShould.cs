namespace Timezones.Business.Tests.Services.TimezoneService
{
    using AutoMapper;
    using Moq;
    using System.Threading.Tasks;
    using Timezones.Business.Services.Timezones;
    using Timezones.Business.Services.Timezones.Models;
    using Timezones.Business.Services.Users;
    using Timezones.Data.Models;
    using Timezones.Data.Repositories;
    using Xunit;

    public class AddAsyncShould
    {
        private Mock<ITimezoneRepository> mockTimezoneRepository;
        private Mock<IUserProvider> mockUserProvider;

        public AddAsyncShould()
        {
            this.mockTimezoneRepository = new Mock<ITimezoneRepository>();
            this.mockUserProvider = new Mock<IUserProvider>();
        }

        [Fact]
        public async Task AddTimezone()
        {
            // Arrange
            var mockMapper = new Mock<IMapper>();
            mockMapper
                .Setup(x => x.Map<Timezone>(It.IsAny<AddTimezoneDTO>()))
                .Returns(new Timezone());

            this.mockUserProvider.Setup(p => p.UserId).Returns(1);

            var service = new TimezoneService(
                this.mockTimezoneRepository.Object,
                null,
                this.mockUserProvider.Object,
                mockMapper.Object);

            // Act
            TimezoneDTO result = await service.AddAsync(new AddTimezoneDTO());

            // Assert
            this.mockTimezoneRepository.Verify(r => r.AddAsync(It.IsAny<Timezone>()), Times.Once);
            this.mockTimezoneRepository.Verify(r => r.SaveChangesAsync(), Times.Once);
            mockMapper.Verify(m => m.Map<TimezoneDTO>(It.IsAny<Timezone>()), Times.Once);
        }
    }
}
