using ADNTester.BO.Entities;
using ADNTester.BO.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Repository.Interfaces
{
    public interface ITestBookingRepository : IGenericRepository<TestBooking>
    {
        Task<IEnumerable<TestBooking>> GetFilteredBookingsAsync(SampleCollectionMethod? method, DateTime? appointDate);
    }
}
