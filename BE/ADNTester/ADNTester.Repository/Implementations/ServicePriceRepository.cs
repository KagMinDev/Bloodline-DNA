using ADNTester.BO.Entities;
using ADNTester.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Repository.Implementations
{
    public class ServicePriceRepository : GenericRepository<ServicePrice>, IServicePriceRepository
    {
        public ServicePriceRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
