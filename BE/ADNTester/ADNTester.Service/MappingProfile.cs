using ADNTester.BO.DTOs.User;
using ADNTester.BO.Entities;
using ADNTester.BO.Enums;
using AutoMapper;

namespace ADNTester.Service
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //User mapping
            CreateMap<User, UserDto>();

            CreateMap<CreateUserDto, User>()
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => Enum.Parse<UserRole>(src.Role, true)));
            CreateMap<User, CreateUserDto>()
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));
            CreateMap<UpdateUserDto, User>();
        }

    }
}
