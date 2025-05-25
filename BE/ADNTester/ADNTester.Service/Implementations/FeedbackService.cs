using ADNTester.BO.DTOs;
using ADNTester.BO.Entities;
using ADNTester.Repository.Interfaces;
using ADNTester.Service.Interfaces;
using AutoMapper;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADNTester.Service.Implementations
{
    public class FeedbackService : IFeedbackService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public FeedbackService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<FeedbackDto>> GetAllAsync()
        {
            var feedbacks = await _unitOfWork.FeedbackRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<FeedbackDto>>(feedbacks);
        }

        public async Task<FeedbackDto> GetByIdAsync(string id)
        {
            var feedback = await _unitOfWork.FeedbackRepository.GetByIdAsync(id);
            return feedback == null ? null : _mapper.Map<FeedbackDto>(feedback);
        }

        public async Task<string> CreateAsync(CreateFeedbackDto dto)
        {
            var feedback = _mapper.Map<Feedback>(dto);
            await _unitOfWork.FeedbackRepository.AddAsync(feedback);
            await _unitOfWork.SaveChangesAsync();
            return feedback.Id;
        }

        public async Task<bool> UpdateAsync(UpdateFeedbackDto dto)
        {
            var feedback = await _unitOfWork.FeedbackRepository.GetByIdAsync(dto.Id);
            if (feedback == null)
                return false;

            _mapper.Map(dto, feedback);
            _unitOfWork.FeedbackRepository.Update(feedback);
            return await _unitOfWork.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var feedback = await _unitOfWork.FeedbackRepository.GetByIdAsync(id);
            if (feedback == null)
                return false;

            _unitOfWork.FeedbackRepository.Remove(feedback);
            return await _unitOfWork.SaveChangesAsync() > 0;
        }
    }
} 