using ADNTester.BO.DTOs.SampleInstruction;
using ADNTester.BO.Entities;
using ADNTester.BO.Enums;
using ADNTester.Repository.Interfaces;
using ADNTester.Service.Interfaces;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Service.Implementations
{
    public class SampleInstructionService : ISampleInstructionService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public SampleInstructionService( IUnitOfWork unitOfWork, IMapper mapper)
        {
             _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<IEnumerable<SampleInstructionDto>> GetAllAsync()
        {
            var entities = await _unitOfWork.SampleInstructionRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<SampleInstructionDto>>(entities);
        }

        public async Task<SampleInstructionDto?> GetByIdAsync(string id)
        {
            var entity = await _unitOfWork.SampleInstructionRepository.GetByIdAsync(id);
            return _mapper.Map<SampleInstructionDto?>(entity);
        }

        public async Task<SampleInstructionDto> CreateAsync(CreateSampleInstructionDto dto)
        {
            var entity = _mapper.Map<SampleTypeInstruction>(dto);
            await _unitOfWork.SampleInstructionRepository.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<SampleInstructionDto>(entity);
        }

        public async Task<bool> UpdateAsync(UpdateSampleInstructionDto dto)
        {
            var entity = _mapper.Map<SampleTypeInstruction>(dto);
            _unitOfWork.SampleInstructionRepository.Update(entity);
            return await _unitOfWork.SaveChangesAsync() > 0;
        }
        public async Task<bool> SeedDefaultInstructionsAsync()
        {
            var existing = await _unitOfWork.SampleInstructionRepository.GetAllAsync();
            if (existing.Any()) return false; // Prevent duplicate seeding

            var now = DateTime.UtcNow;
            var seedInstructions = new List<SampleTypeInstruction>
            {
                new()
                {
                    SampleType = SampleType.BuccalSwab,
                    InstructionText = "Sử dụng một tăm bông sạch, chà nhẹ vào mặt trong của má trong ít nhất 30 giây để thu thập tế bào niêm mạc. Lặp lại thao tác với tăm bông khác ở má còn lại.\n Đảm bảo không ăn, uống hoặc đánh răng 30 phút trước khi lấy mẫu.",
                    CreatedAt = now,
                    UpdatedAt = now
                },
                new()
                {
                    SampleType = SampleType.Blood,
                    InstructionText = "Dùng bộ lấy máu vô trùng để chích ngón tay và thu thập vài giọt máu vào ống nghiệm hoặc giấy thấm chuyên dụng.\n Đảm bảo tay sạch và không chạm vào vùng lấy mẫu sau khi sát trùng.",
                    CreatedAt = now,
                    UpdatedAt = now
                },
                new()
                {
                    SampleType = SampleType.HairWithRoot,
                    InstructionText = "Nhổ khoảng 8–10 sợi tóc từ chân tóc (gốc tóc phải còn nguyên). Không dùng kéo cắt. Cho tóc vào túi zip sạch.\n Kiểm tra từng sợi phải còn gốc trắng (nang tóc).",
                    CreatedAt = now,
                    UpdatedAt = now
                },
                new()
                {
                    SampleType = SampleType.Fingernail,
                    InstructionText = "Cắt 3–5 móng tay bằng bấm móng đã khử trùng. Cho móng vào túi sạch, không dính hóa chất.\n Mẫu phải khô ráo, không sơn móng, không có bụi bẩn.",
                    CreatedAt = now,
                    UpdatedAt = now
                },
                new()
                {
                    SampleType = SampleType.Saliva,
                    InstructionText = "Nhổ nước bọt trực tiếp vào ống thu mẫu đến vạch quy định (khoảng 2ml). Không ăn uống hoặc súc miệng 30 phút trước đó.\n Đảm bảo nước bọt không có bọt khí, không lẫn thức ăn.",
                    CreatedAt = now,
                    UpdatedAt = now
                },
                new()
                {
                    SampleType = SampleType.Other,
                    InstructionText = "Liên hệ nhân viên hỗ trợ để được hướng dẫn cách lấy mẫu phù hợp với trường hợp đặc biệt.\n Không tự ý thu mẫu nếu chưa rõ quy trình.",
                    CreatedAt = now,
                    UpdatedAt = now
                }
            };

            foreach (SampleType type in Enum.GetValues(typeof(SampleType)))
            {
                if (type == SampleType.Unknown) continue;

                bool exists = existing.Any(x => x.SampleType == type);
                if (!exists)
                {
                    var instruction = seedInstructions.First(x => x.SampleType == type);
                    await _unitOfWork.SampleInstructionRepository.AddAsync(instruction);
                }
            }

           return await _unitOfWork.SaveChangesAsync() > 0;
        }

        public async Task<SampleInstructionDto?> GetLatestBySampleTypeAsync(SampleType type)
        {
            var all = await _unitOfWork.SampleInstructionRepository.GetAllAsync();

            var latest = all
                .Where(x => x.SampleType == type)
                .OrderByDescending(x => x.UpdatedAt) // or CreatedAt if you prefer
                .FirstOrDefault();

            return latest is null ? null : _mapper.Map<SampleInstructionDto>(latest);
        }
    }
}
