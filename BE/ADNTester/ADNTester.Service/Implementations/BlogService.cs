using ADNTester.BO.DTOs;
using ADNTester.BO.Entities;
using ADNTester.Repository.Interfaces;
using ADNTester.Service.Interfaces;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADNTester.Service.Implementations
{
    public class BlogService : IBlogService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public BlogService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<BlogDto>> GetAllAsync()
        {
            var blogs = await _unitOfWork.IBlogRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<BlogDto>>(blogs);
        }

        public async Task<BlogDto> GetByIdAsync(string id)
        {
            var blog = await _unitOfWork.IBlogRepository.GetByIdAsync(id);
            return blog == null ? null : _mapper.Map<BlogDto>(blog);
        }

        public async Task<string> CreateAsync(CreateBlogDto dto)
        {
            // Validate author exists
            var author = await _unitOfWork.UserRepository.GetByIdAsync(dto.AuthorId);
            if (author == null)
                throw new Exception("Author not found");

            // Validate tags exist
            if (dto.TagIds != null && dto.TagIds.Any())
            {
                foreach (var tagId in dto.TagIds)
                {
                    var tag = await _unitOfWork.TagRepository.GetByIdAsync(tagId);
                    if (tag == null)
                        throw new Exception($"Tag with id {tagId} not found");
                }
            }

            var blog = _mapper.Map<Blog>(dto);
            blog.Tags = dto.TagIds?.Select(tagId => new BlogTag { TagId = tagId }).ToList();

            await _unitOfWork.IBlogRepository.AddAsync(blog);
            await _unitOfWork.SaveChangesAsync();
            return blog.Id;
        }

        public async Task<bool> UpdateAsync(UpdateBlogDto dto)
        {
            var blog = await _unitOfWork.IBlogRepository.GetByIdAsync(dto.Id);
            if (blog == null)
                return false;

            // Validate tags exist
            if (dto.TagIds != null && dto.TagIds.Any())
            {
                foreach (var tagId in dto.TagIds)
                {
                    var tag = await _unitOfWork.TagRepository.GetByIdAsync(tagId);
                    if (tag == null)
                        throw new Exception($"Tag with id {tagId} not found");
                }
            }

            _mapper.Map(dto, blog);

            // Update tags
            if (dto.TagIds != null)
            {
                blog.Tags.Clear();
                blog.Tags = dto.TagIds.Select(tagId => new BlogTag { TagId = tagId }).ToList();
            }

            _unitOfWork.IBlogRepository.Update(blog);
            return await _unitOfWork.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var blog = await _unitOfWork.IBlogRepository.GetByIdAsync(id);
            if (blog == null)
                return false;

            _unitOfWork.IBlogRepository.Remove(blog);
            return await _unitOfWork.SaveChangesAsync() > 0;
        }
    }
} 