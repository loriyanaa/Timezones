namespace Timezones.Business.Services.Timezones.Models.Profile
{
    using AutoMapper;
    using global::Timezones.Data.Models;

    public class TimezoneProfile : Profile
    {
        public TimezoneProfile()
        {
            this.CreateMap<Timezone, TimezoneDTO>();

            this.CreateMap<AddTimezoneDTO, Timezone>();

            this.CreateMap<UpdateTimezoneDTO, Timezone>();
        }
    }
}
