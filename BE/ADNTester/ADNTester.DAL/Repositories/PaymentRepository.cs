using ADNTester.BO.Models;
using ADNTester.DAL.Data;
using ADNTester.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace ADNTester.DAL.Repositories
{
    public class PaymentRepository : GenericRepository<Payment>, IPaymentRepository
    {
        public PaymentRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Payment> GetByOrderCodeAsync(string orderCode)
        {
            return await _context.Payments
                .FirstOrDefaultAsync(p => p.OrderCode == orderCode);
        }
    }
} 