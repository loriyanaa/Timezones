namespace Timezones.Business.Services.Users.Models.Profile
{
    using AutoMapper;
    using global::Timezones.Data.Models;

    public class UserProfile : Profile
    {
        public UserProfile()
        {
            this.CreateMap<User, UserDTO>()
                .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => 
                    src.UserRoles.FirstOrDefault() != null ? src.UserRoles.FirstOrDefault().Role.Name : null));

            this.CreateMap<UpdateUserDTO, User>();

            this.CreateMap<AddUserDTO, User>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email));
        }
    }
}
