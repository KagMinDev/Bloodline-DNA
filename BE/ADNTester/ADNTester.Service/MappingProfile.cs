using ADNTester.BO.DTOs.User;
using ADNTester.BO.DTOs;
using ADNTester.BO.DTOs.TestBooking;
using ADNTester.BO.DTOs.TestKit;
using ADNTester.BO.DTOs.TestResult;
using ADNTester.BO.DTOs.TestSample;
using ADNTester.BO.Entities;
using ADNTester.BO.Enums;
using AutoMapper;
using System.Linq;
using ADNTester.BO.DTOs.Feedback;
using ADNTester.BO.DTOs.SampleInstruction;
using ADNTester.BO.DTOs.Payment;
using ADNTester.BO.DTOs.Tag;
using ADNTester.BO.DTOs.BlogTag;
using ADNTester.BO.DTOs.Logistic;

namespace ADNTester.Service
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            #region User Mapping
            CreateMap<User, UserDto>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));

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
            CreateMap<TestService, TestServiceDto>()
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Type.ToString()));
            CreateMap<CreateTestServiceDto, TestService>();
            CreateMap<UpdateTestServiceDto, TestService>();
            #endregion

            #region ServicePrice Mapping
            CreateMap<ServicePrice, PriceServiceDto>()
                
                .ForMember(dest => dest.CollectionMethod, opt => opt.MapFrom(src => src.CollectionMethod.ToString()))
                .ForMember(dest => dest.TestServiceInfor, opt => opt.MapFrom(src => src.Service));
            CreateMap<CreatePriceServiceDto, ServicePrice>();
            CreateMap<UpdatePriceServiceDto, ServicePrice>();
            #endregion

            #region Feedback Mapping
            CreateMap<Feedback, FeedbackDto>();
            CreateMap<CreateFeedbackDto, Feedback>();
            CreateMap<UpdateFeedbackDto, Feedback>();
            CreateMap<Feedback, FeedbackDetailDto>()
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User)).
                ForMember(dest => dest.Service, opt => opt.MapFrom(src => src.TestService));
            #endregion

            #region TestKit Mapping
            CreateMap<TestKit, TestKitDto>();
            CreateMap<CreateTestKitDto, TestKit>();
            CreateMap<UpdateTestKitDto, TestKit>();
            CreateMap<TestKit, TestKitDetailDto>();
            #endregion

            #region TestResult Mapping
            CreateMap<TestResult, TestResultDto>();
            CreateMap<CreateTestResultDto, TestResult>();
            CreateMap<CreateTestResultWithFileDto, TestResult>();
            CreateMap<UpdateTestResultDto, TestResult>();
            CreateMap<UpdateTestResultWithFileDto, TestResult>();
            CreateMap<TestResult, TestResultDetailDto>()
                .ForMember(dest => dest.Client, opt => opt.MapFrom(src => src.TestBooking.Client));
            #endregion

            #region TestSample Mapping
            CreateMap<TestSample, TestSampleDto>()
                .ForMember(dest => dest.RelationshipToSubject, opt => opt.MapFrom(src => src.RelationshipToSubject.ToString()))
                .ForMember(dest => dest.SampleType, opt => opt.MapFrom(src => src.SampleType.ToString()));

            CreateMap<TestSample, TestSampleDetailDto>()
                .ForMember(dest => dest.RelationshipToSubject, opt => opt.MapFrom(src => src.RelationshipToSubject.ToString()))
                .ForMember(dest => dest.SampleType, opt => opt.MapFrom(src => src.SampleType.ToString()));
            CreateMap<CreateTestSampleDto, TestSample>();

            CreateMap<CreateTestSampleFromClientDto, TestSample>()
                .ForMember(dest => dest.SampleCode, opt => opt.Ignore())
                .ForMember(dest => dest.CollectedById, opt => opt.Ignore())
                .ForMember(dest => dest.CollectedAt, opt => opt.Ignore())
                .ForMember(dest => dest.LabReceivedAt, opt => opt.Ignore());

            CreateMap<UpdateTestSampleDto, TestSample>();
            #endregion

            #region TestBooking Mapping
            CreateMap<TestBooking, TestBookingDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.KitId, opt => opt.MapFrom(src => src.Kit.Id));
            CreateMap<TestBooking, TestBookingDetailDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.Client, opt => opt.MapFrom(src => src.Client))
                .ForMember(dest => dest.TestService, opt => opt.MapFrom(src => src.TestService));
            CreateMap<CreateTestBookingDto, TestBooking>();
            CreateMap<UpdateTestBookingDto, TestBooking>();
            #endregion

            #region Blog Mapping
            CreateMap<Blog, BlogDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.AuthorName, opt => opt.MapFrom(src => src.Author.FullName));
            CreateMap<CreateBlogWithUrlDto, Blog>();
            CreateMap<UpdateBlogDto, Blog>();
            #endregion

            #region SampleInstruction Mapping
            CreateMap<SampleTypeInstruction, SampleInstructionDto>().ReverseMap();

            CreateMap<CreateSampleInstructionDto, SampleTypeInstruction>();
            CreateMap<UpdateSampleInstructionDto, SampleTypeInstruction>();
            #endregion

            #region Payment Mapping
            CreateMap<Payment, PaymentDto>()
                .ForMember(dest => dest.Booking, opt => opt.MapFrom(src => src.Booking))
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.Booking.Client))
                .ReverseMap();
            CreateMap<Payment, PaymentDetailDto>()
                .ForMember(dest => dest.Booking, opt => opt.MapFrom(src => src.Booking))
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.Booking.Client));
            CreateMap<CreatePaymentDto, Payment>();
            CreateMap<UpdatePaymentDto, Payment>();
            #endregion

            #region Tag Mapping
            CreateMap<Tag, TagDto>().ReverseMap();
            CreateMap<CreateTagDto, Tag>();
            CreateMap<UpdateTagDto, Tag>();
            #endregion

            #region BlogTag Mapping
            CreateMap<BlogTag, BlogTagDto>();
            CreateMap<CreateBlogTagDto, BlogTag>();
            #endregion

            #region Logistic
            CreateMap<CreateLogisticsInfoDto, LogisticsInfo>()
            .ForMember(dest => dest.Status, opt => opt.Ignore()) // default status
            .ForMember(dest => dest.CompletedAt, opt => opt.Ignore()) // not set at creation
            .ForMember(dest => dest.Staff, opt => opt.Ignore()) // navigation prop
            .ForMember(dest => dest.Id, opt => opt.Ignore());   // auto-generated

            CreateMap<LogisticsInfo, LogisticsInfoDto>()
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.EvidenceImageUrl))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));
            

            #endregion
        }
    }
}

