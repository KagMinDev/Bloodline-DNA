using ADNTester.BO.DTOs;
using ADNTester.BO.DTOs.TestSample;
using ADNTester.BO.Entities;
using ADNTester.Repository.Interfaces;
using ADNTester.Service.Interfaces;
using AutoMapper;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System;
using ADNTester.BO.Enums;
using ADNTester.Service.Helper;

namespace ADNTester.Service.Implementations
{
    public class TestSampleService : ITestSampleService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public TestSampleService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<TestSampleDto>> GetAllAsync()
        {
            var testSamples = await _unitOfWork.TestSampleRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<TestSampleDto>>(testSamples);
        }

        public async Task<TestSampleDto> GetByIdAsync(string id)
        {
            var testSample = await _unitOfWork.TestSampleRepository.GetByIdAsync(id);
            return testSample == null ? null : _mapper.Map<TestSampleDto>(testSample);
        }

        public async Task<string> CreateAsync(CreateTestSampleDto dto)
        {
            // Lấy thông tin kit
            var kit = await _unitOfWork.TestKitRepository.GetByIdAsync(dto.KitId);
            if (kit == null)
                throw new Exception("Kit không tồn tại");

            // Lấy thông tin booking
            var booking = await _unitOfWork.TestBookingRepository.GetByIdAsync(kit.BookingId);
            if (booking == null)
                throw new Exception("Không tìm thấy thông tin đặt lịch");

            // Kiểm tra trạng thái booking
            if (booking.Status == BookingStatus.CheckIn)
            {
                booking.Status = BookingStatus.StaffGettingSample;
                booking.UpdatedAt = DateTime.UtcNow;
                _unitOfWork.TestBookingRepository.Update(booking);
            }

            if (booking.Status != BookingStatus.StaffGettingSample)
            {
                throw new Exception($"Không thể tạo sample. Trạng thái đặt lịch hiện tại là {booking.Status}, yêu cầu phải ở trạng thái CheckIn hoặc StaffGettingSample.");
            }

            // Normalize donor name
            var newDonor = dto.DonorName?.Trim().ToLower() ?? "";

            // Lấy toàn bộ sample của kit này
            var existingSamples = (await _unitOfWork.TestSampleRepository.GetAllAsync())
                                    .Where(s => s.KitId == dto.KitId)
                                    .ToList();

            // Kiểm tra số lượng sample hiện tại
            if (existingSamples.Count >= kit.SampleCount)
                throw new Exception($"Kit này chỉ cho phép tối đa {kit.SampleCount} sample. Hiện tại đã có {existingSamples.Count}.");

            // Kiểm tra 1 người tối đa 2 mẫu
            var donorSampleCount = existingSamples
                .Count(s => (s.DonorName?.Trim().ToLower() ?? "") == newDonor);

            if (donorSampleCount >= 2)
                throw new Exception($"Người có tên \"{dto.DonorName}\" đã có {donorSampleCount} mẫu. Mỗi người chỉ được tối đa 2 mẫu.");

            // Nếu đã có n - 1 sample rồi, đảm bảo có ít nhất 2 người khác nhau
            if (existingSamples.Count == kit.SampleCount - 1)
            {
                var uniqueDonors = existingSamples
                    .Select(s => s.DonorName?.Trim().ToLower() ?? "")
                    .Distinct()
                    .ToList();

                if (!uniqueDonors.Contains(newDonor))
                    uniqueDonors.Add(newDonor);

                if (uniqueDonors.Count < 2)
                    throw new Exception("Cần ít nhất 2 người cho mẫu thử. Hãy thêm mẫu từ người khác.");
            }

            // Sinh SampleCode không trùng
            string generatedCode;
            var existingCodes = existingSamples.Select(s => s.SampleCode).ToHashSet();

            do
            {
                generatedCode = SampleCodeHelper.Generate();
            }
            while (existingCodes.Contains(generatedCode));

            var testSample = _mapper.Map<TestSample>(dto);
            testSample.SampleCode = generatedCode;

            await _unitOfWork.TestSampleRepository.AddAsync(testSample);
            await _unitOfWork.SaveChangesAsync();
            return testSample.Id;
        }

        public async Task<bool> UpdateAsync(UpdateTestSampleDto dto)
        {
            var testSample = await _unitOfWork.TestSampleRepository.GetByIdAsync(dto.Id);
            if (testSample == null)
                return false;

            _mapper.Map(dto, testSample);
            _unitOfWork.TestSampleRepository.Update(testSample);
            return await _unitOfWork.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var testSample = await _unitOfWork.TestSampleRepository.GetByIdAsync(id);
            if (testSample == null)
                return false;

            _unitOfWork.TestSampleRepository.Remove(testSample);
            return await _unitOfWork.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<TestSampleDetailDto>> GetTestSampleByUserId(string userId)
        {
            // Lấy tất cả kit
            var kits = await _unitOfWork.TestKitRepository.GetAllAsync();

            // Lấy tất cả booking của user
            var bookings = await _unitOfWork.TestBookingRepository.GetAllAsync();
            var userBookings = bookings.Where(b => b.ClientId == userId).ToList();
            var userBookingIds = userBookings.Select(b => b.Id).ToList();

            // Lọc các kit thuộc booking của user
            var userKits = kits.Where(k => userBookingIds.Contains(k.BookingId)).ToList();
            var userKitIds = userKits.Select(k => k.Id).ToList();

            // Lấy tất cả sample
            var samples = await _unitOfWork.TestSampleRepository.GetAllAsync();

            // Lọc các sample thuộc kit của user
            var userSamples = samples.Where(s => userKitIds.Contains(s.KitId)).ToList();

            foreach (var sample in userSamples)
            {
                // Lấy thông tin kit
                var kit = userKits.FirstOrDefault(k => k.Id == sample.KitId);
                if (kit != null)
                {
                    // Lấy thông tin booking từ kit
                    var booking = userBookings.FirstOrDefault(b => b.Id == kit.BookingId);
                    if (booking != null)
                    {
                        // Lấy thông tin user từ booking
                        booking.Client = await _unitOfWork.UserRepository.GetByIdAsync(booking.ClientId);
                        // Lấy thông tin test service
                        booking.TestService = await _unitOfWork.TestServiceRepository.GetByIdAsync(booking.TestServiceId);
                        // Gán thông tin booking vào kit
                        kit.Booking = booking;
                    }
                    // Gán thông tin kit vào sample
                    sample.Kit = kit;
                }
            }

            return _mapper.Map<IEnumerable<TestSampleDetailDto>>(userSamples);
        }

        public async Task<IEnumerable<TestSampleDetailDto>> GetTestSampleByKitId(string kitId)
        {
            // Lấy thông tin kit trước
            var kit = await _unitOfWork.TestKitRepository.GetByIdAsync(kitId);
            if (kit == null)
                return null;

            var samples = await _unitOfWork.TestSampleRepository.GetAllAsync();
            var targetSamples = samples.Where(s => s.KitId == kitId).ToList();

            if (!targetSamples.Any())
                return null;

            // Lấy thông tin booking từ kit
            var booking = await _unitOfWork.TestBookingRepository.GetByIdAsync(kit.BookingId);
            if (booking != null)
            {
                // Lấy thông tin user từ booking
                booking.Client = await _unitOfWork.UserRepository.GetByIdAsync(booking.ClientId);
                // Lấy thông tin test service
                booking.TestService = await _unitOfWork.TestServiceRepository.GetByIdAsync(booking.TestServiceId);
                // Gán thông tin booking vào kit
                kit.Booking = booking;
            }

            // Gán thông tin kit vào từng sample
            foreach (var sample in targetSamples)
            {
                sample.Kit = kit;
            }

            return _mapper.Map<IEnumerable<TestSampleDetailDto>>(targetSamples);
        }

        public async Task<string> CreateSampleFromClientAsync(CreateTestSampleFromClientDto dto)
        {
            // Lấy kit và booking như bình thường
            var kit = await _unitOfWork.TestKitRepository.GetByIdAsync(dto.KitId)
                      ?? throw new Exception("Kit không tồn tại");

            var booking = await _unitOfWork.TestBookingRepository.GetByIdAsync(kit.BookingId)
                         ?? throw new Exception("Không tìm thấy thông tin đặt lịch");

            // Kiểm tra trạng thái booking
            if (booking.Status != BookingStatus.WaitingForSample)
                throw new Exception($"Không thể tạo sample. Trạng thái phải là {BookingStatus.WaitingForSample}");

            // Lấy các sample hiện có của kit
            var allSamples = await _unitOfWork.TestSampleRepository.GetAllAsync();
            var kitSamples = allSamples.Where(s => s.KitId == dto.KitId).ToList();

            // Kiểm tra giới hạn mẫu
            if (kitSamples.Count >= kit.SampleCount)
                throw new Exception($"Kit này chỉ cho phép tối đa {kit.SampleCount} mẫu. Hiện tại đã có {kitSamples.Count}.");

            // Kiểm tra giới hạn theo người
            var donorSamples = kitSamples.Count(s => s.DonorName.Trim().ToLower() == dto.DonorName.Trim().ToLower());
            if (donorSamples >= 2)
                throw new Exception($"Mỗi người chỉ có thể lấy tối đa 2 mẫu. '{dto.DonorName}' đã có {donorSamples} mẫu.");

            // Kiểm tra tối thiểu từ 2 người nếu đây là mẫu thứ cuối cùng
            if (kitSamples.Count == kit.SampleCount - 1)
            {
                var distinctDonors = kitSamples.Select(s => s.DonorName.Trim().ToLower()).Distinct().ToList();
                if (!distinctDonors.Contains(dto.DonorName.Trim().ToLower()))
                    distinctDonors.Add(dto.DonorName.Trim().ToLower());

                if (distinctDonors.Count < 2)
                    throw new Exception("Cần ít nhất 2 người cung cấp mẫu để thực hiện xét nghiệm.");
            }
            //Gen Sample code không duplicate
            string generatedCode;
            var existingCodes = allSamples.Select(s => s.SampleCode).ToHashSet();

            do
            {
                generatedCode = SampleCodeHelper.Generate();
            }
            while (existingCodes.Contains(generatedCode));

            // Map và tạo sample
            var sample = _mapper.Map<TestSample>(dto);
            sample.SampleCode = generatedCode; // helper tạo mã
            sample.CollectedAt = DateTime.UtcNow;

            await _unitOfWork.TestSampleRepository.AddAsync(sample);
            await _unitOfWork.SaveChangesAsync();

            return sample.Id;
        }
    }
}