using ADNTester.Repository.Implementations;
using ADNTester.Repository.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Repository
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddRepositoryDependencies(this IServiceCollection services)
        {
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            services.AddScoped<IBlogRepository, BlogRepository>();
            services.AddScoped<IFeedbackRepository, FeedbackRepository>();
            services.AddScoped<IServicePriceRepository, ServicePriceRepository>();
            services.AddScoped<ITagRepository, TagRepository>();
            services.AddScoped<ITestBookingRepository, TestBookingRepository>();
            services.AddScoped<ITestKitRepository, TestKitRepository>();
            services.AddScoped<ITestResultRepository, TestResultRepository>();
            services.AddScoped<ITestSampleRepository, TestSampleRepository>();
            services.AddScoped<ITestServiceRepository, TestServiceRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IPaymentRepository, PaymentRepository>();
            services.AddScoped<ISampleInstructionRepository, SampleInstructionRepository>();
            services.AddScoped<IOtpRepository, OtpRepository>();

            return services;
        }
    }
}
