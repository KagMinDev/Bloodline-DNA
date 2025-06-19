using ADNTester.Repository.Implementations;
using ADNTester.Repository.Interfaces;
using ADNTester.Service.Implementations;
using ADNTester.Service.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http;

namespace ADNTester.Service
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddServiceDependencies(this IServiceCollection services)
        {
            // Đăng ký các Service
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IJwtTokenService, JwtTokenService>();
            services.AddScoped<ITestServiceService, TestServiceService>();
            services.AddScoped<ITestBookingService, TestBookingService>();
            services.AddScoped<IServicePriceService, ServicePriceService>();
            services.AddScoped<IBlogService, BlogService>();
            services.AddScoped<IFeedbackService, FeedbackService>();
            services.AddScoped<ITestKitService, TestKitService>();
            services.AddScoped<ITestResultService, TestResultService>();
            services.AddScoped<ITestSampleService, TestSampleService>();
            services.AddScoped<ICloudinaryService, CloudinaryService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<ISampleInstructionService, SampleInstructionService>();
            services.AddScoped<IPaymentService, PaymentService>();
            services.AddScoped<IOtpService, OtpService>();

            // Đăng ký AutoMapper
            services.AddAutoMapper(typeof(MappingProfile).Assembly);

            // Register PayOS service
          

            return services;
        }
    }
}
