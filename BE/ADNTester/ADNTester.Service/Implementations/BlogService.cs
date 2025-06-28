using ADNTester.BO.DTOs;
using ADNTester.BO.Entities;
using ADNTester.Repository.Interfaces;
using ADNTester.Service.Interfaces;
using AutoMapper;
using System;
using System.Collections.Generic;
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
            foreach (var blog in blogs)
            {
                blog.Author = await _unitOfWork.UserRepository.GetByIdAsync(blog.AuthorId);
            }
            return _mapper.Map<IEnumerable<BlogDto>>(blogs);
        }

        public async Task<BlogDto> GetByIdAsync(string id)
        {
            var blog = await _unitOfWork.IBlogRepository.GetByIdAsync(id);
            if (blog == null)
                return null;

            blog.Author = await _unitOfWork.UserRepository.GetByIdAsync(blog.AuthorId);
            return _mapper.Map<BlogDto>(blog);
        }

        public async Task<string> CreateAsync(CreateBlogWithUrlDto dto)
        {
            // Validate author exists
            var author = await _unitOfWork.UserRepository.GetByIdAsync(dto.AuthorId);
            if (author == null)
                throw new Exception("Author not found");

            var blog = _mapper.Map<Blog>(dto);
            await _unitOfWork.IBlogRepository.AddAsync(blog);
            await _unitOfWork.SaveChangesAsync();
            return blog.Id;
        }

        public async Task<string> CreateWithTagsAsync(CreateBlogWithTagsDto dto)
        {
            // Validate author exists
            var author = await _unitOfWork.UserRepository.GetByIdAsync(dto.AuthorId);
            if (author == null)
                throw new Exception("Author not found");

            // Create blog
            var blog = new Blog
            {
                Title = dto.Title,
                Content = dto.Content,
                ThumbnailURL = dto.ThumbnailURL,
                Status = dto.Status,
                AuthorId = dto.AuthorId
            };

            await _unitOfWork.IBlogRepository.AddAsync(blog);
            await _unitOfWork.SaveChangesAsync();

            // Create blog tags if tag IDs are provided
            if (dto.TagIds != null && dto.TagIds.Count > 0)
            {
                foreach (var tagId in dto.TagIds)
                {
                    // Validate tag exists
                    var tag = await _unitOfWork.TagRepository.GetByIdAsync(tagId);
                    if (tag != null)
                    {
                        var blogTag = new BlogTag
                        {
                            BlogId = blog.Id,
                            TagId = tagId
                        };
                        await _unitOfWork.BlogTagRepository.AddAsync(blogTag);
                    }
                }
                await _unitOfWork.SaveChangesAsync();
            }

            return blog.Id;
        }

        public async Task<bool> UpdateAsync(UpdateBlogDto dto)
        {
            var blog = await _unitOfWork.IBlogRepository.GetByIdAsync(dto.Id);
            if (blog == null)
                return false;

            _mapper.Map(dto, blog);
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