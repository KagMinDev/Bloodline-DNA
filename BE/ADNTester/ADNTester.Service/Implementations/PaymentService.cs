using ADNTester.BO.DTOs.Payment;
using ADNTester.BO.Entities;
using ADNTester.Repository.Interfaces;
using ADNTester.Service.Interfaces;
using AutoMapper;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Service.Implementations
{
    public class PaymentService : IPaymentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<PaymentService> _logger;

        public PaymentService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<PaymentService> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<PaymentDto>> GetAllAsync()
        {
            var payments = await _unitOfWork.PaymentRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<PaymentDto>>(payments);
        }

        public async Task<PaymentDto?> GetByIdAsync(string id)
        {
            var payment = await _unitOfWork.PaymentRepository.GetByIdAsync(id);
            return payment == null ? null : _mapper.Map<PaymentDto>(payment);
        }

        public async Task<PaymentDto> CreateAsync(CreatePaymentDto dto)
        {
            var entity = _mapper.Map<Payment>(dto);
            await _unitOfWork.PaymentRepository.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<PaymentDto>(entity);
        }

        public async Task<bool> UpdateAsync(UpdatePaymentDto dto)
        {
            var existing = await _unitOfWork.PaymentRepository.GetByIdAsync(dto.Id);
            if (existing == null)
            {
                return false;
            }

            _mapper.Map(dto, existing);
            _unitOfWork.PaymentRepository.Update(existing);
            return await _unitOfWork.SaveChangesAsync() > 0;
            
        }
    }
}
