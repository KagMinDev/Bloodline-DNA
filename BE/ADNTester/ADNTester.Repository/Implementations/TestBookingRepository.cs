using ADNTester.BO.Entities;
using ADNTester.BO.Enums;
using ADNTester.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Repository.Implementations
{
    public class TestBookingRepository : GenericRepository<TestBooking>, ITestBookingRepository
    {
        public TestBookingRepository(ApplicationDbContext context) : base(context)
        {

        }
        public async Task<IEnumerable<TestBooking>> GetFilteredBookingsAsync(SampleCollectionMethod? method, DateTime? appointDate)
        {
            var query = _dbSet.AsQueryable();

            if (method.HasValue)
                query = query.Where(b => b.CollectionMethod == method.Value);

            if (appointDate.HasValue)
            {
                var date = appointDate.Value.Date;
                query = query.Where(b => b.AppointmentDate.Date == date);
            }

            return await query.ToListAsync();
        }
    }
}
