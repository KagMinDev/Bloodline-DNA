using ADNTester.BO.DTOs.Payment;
using ADNTester.BO.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Service.Interfaces
{
    public interface IPaymentService
    {
        Task<IEnumerable<PaymentDto>> GetAllAsync();
        Task<PaymentDto?> GetByIdAsync(string id);
        Task<PaymentDto> CreateAsync(CreatePaymentDto dto);
        Task<bool> UpdateAsync(UpdatePaymentDto dto);
    }
}