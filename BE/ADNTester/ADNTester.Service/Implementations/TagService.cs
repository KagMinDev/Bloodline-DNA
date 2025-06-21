using ADNTester.BO.DTOs.Tag;
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
    public class TagService : ITagService
    {
        private readonly ITagRepository _tagRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<TagService> _logger;

        public TagService(
            ITagRepository tagRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ILogger<TagService> logger)
        {
            _tagRepository = tagRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<TagDto>> GetAllAsync()
        {
            try
            {
                var tags = await _tagRepository.GetAllAsync();
                return _mapper.Map<IEnumerable<TagDto>>(tags);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all tags");
                throw;
            }
        }

        public async Task<TagDto?> GetByIdAsync(string id)
        {
            try
            {
                var tag = await _tagRepository.GetByIdAsync(id);
                return tag == null ? null : _mapper.Map<TagDto>(tag);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting tag by id: {Id}", id);
                throw;
            }
        }

        public async Task<TagDto> CreateAsync(CreateTagDto dto)
        {
            try
            {
                // Kiểm tra tag đã tồn tại chưa
                var existingTag = await _tagRepository.FindOneAsync(t => t.Name.ToLower() == dto.Name.ToLower());
                if (existingTag != null)
                {
                    throw new InvalidOperationException($"Tag '{dto.Name}' đã tồn tại");
                }

                var entity = _mapper.Map<Tag>(dto);
                await _tagRepository.AddAsync(entity);
                await _unitOfWork.SaveChangesAsync();

                return _mapper.Map<TagDto>(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating tag");
                throw;
            }
        }

        public async Task<bool> UpdateAsync(UpdateTagDto dto)
        {
            try
            {
                var existing = await _tagRepository.GetByIdAsync(dto.Id);
                if (existing == null)
                {
                    return false;
                }

                // Kiểm tra tên mới có trùng với tag khác không
                var duplicateTag = await _tagRepository.FindOneAsync(t => 
                    t.Name.ToLower() == dto.Name.ToLower() && t.Id != dto.Id);
                if (duplicateTag != null)
                {
                    throw new InvalidOperationException($"Tag '{dto.Name}' đã tồn tại");
                }

                existing.Name = dto.Name;
                existing.UpdatedAt = DateTime.UtcNow;

                _tagRepository.Update(existing);
                return await _unitOfWork.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating tag: {Id}", dto.Id);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(string id)
        {
            try
            {
                var tag = await _tagRepository.GetByIdAsync(id);
                if (tag == null)
                {
                    return false;
                }

                _tagRepository.Remove(tag);
                return await _unitOfWork.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting tag: {Id}", id);
                throw;
            }
        }

        public async Task<TagDto?> GetByNameAsync(string name)
        {
            try
            {
                var tag = await _tagRepository.FindOneAsync(t => t.Name.ToLower() == name.ToLower());
                return tag == null ? null : _mapper.Map<TagDto>(tag);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting tag by name: {Name}", name);
                throw;
            }
        }

        public async Task<IEnumerable<TagDto>> GetTagsByBlogIdAsync(string blogId)
        {
            try
            {
                var tags = await _tagRepository.FindAsync(t => t.BlogTags.Any(bt => bt.BlogId == blogId));
                return _mapper.Map<IEnumerable<TagDto>>(tags);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting tags by blog id: {BlogId}", blogId);
                throw;
            }
        }
    }
} 