using ADNTester.BO.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADNTester.DAL.Interfaces
{
    public interface IPaymentRepository : IGenericRepository<Payment>
    {
        Task<Payment> GetByOrderCodeAsync(string orderCode);
    }
} 