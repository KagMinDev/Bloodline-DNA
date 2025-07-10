using ADNTester.BO.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Repository.Interfaces
{
    public interface ITestKitRepository : IGenericRepository<TestKit>
    {
        Task<TestKit?> GetWithDeliveryInfoByBookingIdAsync(string bookingId);
        Task<TestKit?> GetWithPickupInfoByBookingIdAsync(string bookingId);
    }
}
