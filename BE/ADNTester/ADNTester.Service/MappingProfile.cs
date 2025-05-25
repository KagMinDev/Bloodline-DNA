using ADNTester.BO.DTOs.User;
using ADNTester.BO.DTOs;
using ADNTester.BO.DTOs.TestBooking;
using ADNTester.BO.Entities;
using ADNTester.BO.Enums;
using AutoMapper;

namespace ADNTester.Service
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            #region User Mapping
            CreateMap<User, UserDto>();

            // Map User → UserProfileDto
            CreateMap<User, UserProfileDto>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));

            // Map UpdateProfileDto → User
            CreateMap<UpdateProfileDto, User>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Email, opt => opt.Ignore())
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.Role, opt => opt.Ignore());
            #endregion

            #region TestService Mapping
            CreateMap<TestService, TestServiceDto>();
            CreateMap<CreateTestServiceDto, TestService>();
            CreateMap<UpdateTestServiceDto, TestService>();
            #endregion

            #region ServicePrice Mapping
            CreateMap<ServicePrice, PriceServiceDto>();
            CreateMap<CreatePriceServiceDto, ServicePrice>();
            CreateMap<UpdatePriceServiceDto, ServicePrice>();
            #endregion

            #region Feedback Mapping
            CreateMap<Feedback, FeedbackDto>();
            CreateMap<CreateFeedbackDto, Feedback>();
            CreateMap<UpdateFeedbackDto, Feedback>();
            #endregion

            #region TestKit Mapping
            CreateMap<TestKit, TestKitDto>();
            CreateMap<CreateTestKitDto, TestKit>();
            CreateMap<UpdateTestKitDto, TestKit>();
            #endregion

            #region TestResult Mapping
            CreateMap<TestResult, TestResultDto>();
            CreateMap<CreateTestResultDto, TestResult>();
            CreateMap<UpdateTestResultDto, TestResult>();
            #endregion

            #region TestSample Mapping
            CreateMap<TestSample, TestSampleDto>();
            CreateMap<CreateTestSampleDto, TestSample>();
            CreateMap<UpdateTestSampleDto, TestSample>();
            #endregion

            #region TestBooking Mapping
            CreateMap<TestBooking, TestBookingDto>();
            CreateMap<BO.DTOs.TestBooking.CreateTestBookingDto, TestBooking>();
            CreateMap<UpdateTestBookingDto, TestBooking>();
            #endregion
        }
    }
}
