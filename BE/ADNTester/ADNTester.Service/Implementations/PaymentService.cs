using ADNTester.BO.DTOs.Payment;
using ADNTester.BO.Entities;
using ADNTester.BO.Enums;
using ADNTester.Repository.Interfaces;
using ADNTester.Service.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
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
        private readonly IPaymentRepository _paymentRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<PaymentService> _logger;

        public PaymentService(
            IPaymentRepository paymentRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ILogger<PaymentService> logger)
        {
            _paymentRepository = paymentRepository;
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
          
        public async Task<Payment> GetByBookingIdAsync(string bookingId)
        {
            try
            {
                var payment = await _paymentRepository.FindOneAsync( x=> x.BookingId == bookingId);


                return payment;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting payment by booking ID: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> UpdatePaymentStatusAsync(string bookingId, PaymentStatus status)
        {
            try
            {
                var payment = await GetByBookingIdAsync(bookingId);
                if (payment == null)
                {
                    return false;
                }

                payment.Status = status;
                payment.UpdatedAt = DateTime.UtcNow;

                _paymentRepository.Update(payment);
                await _unitOfWork.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating payment status: {ex.Message}");
                throw;
            }
        }

        public async Task<IEnumerable<PaymentDetailDto>> GetDepositedPaymentsWithSampleReceivedAsync()
        {
            try
            {
                // Lấy tất cả payment có trạng thái Deposited
                var depositedPayments = await _paymentRepository.FindAsync(p => p.Status == PaymentStatus.Deposited);
                
                // Lọc ra những payment có booking status là SampleReceived
                var result = new List<Payment>();
                foreach (var payment in depositedPayments)
                {
                    // Load booking với đầy đủ thông tin
                    var booking = await _unitOfWork.TestBookingRepository.GetByIdAsync(payment.BookingId);
                    
                        // Load thông tin user
                        var user = await _unitOfWork.UserRepository.GetByIdAsync(booking.ClientId);
                        if (user != null)
                        {
                            booking.Client = user;
                        }
                        
                        // Load thông tin test service
                        var testService = await _unitOfWork.TestServiceRepository.GetByIdAsync(booking.TestServiceId);
                        if (testService != null)
                        {
                            booking.TestService = testService;
                        }
                        
                        payment.Booking = booking;
                        result.Add(payment);
                    }
                

                return _mapper.Map<IEnumerable<PaymentDetailDto>>(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting deposited payments with sample received");
                throw;
            }
        }
    }
}