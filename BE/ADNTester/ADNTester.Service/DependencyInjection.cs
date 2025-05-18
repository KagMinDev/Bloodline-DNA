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

namespace ADNTester.Service
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddServiceDependencies(this IServiceCollection services)
        {
            // Đăng ký các Service
            services.AddScoped<IUserService, UserService>();
            // Thêm các service khác tương tự

            // Đăng ký AutoMapper (nếu chưa đăng ký ở Program.cs)
            services.AddAutoMapper(typeof(MappingProfile).Assembly);

            return services;
        }
    }
}
