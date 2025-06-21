using ADNTester.BO.DTOs.BlogTag;
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
    public class BlogTagService : IBlogTagService
    {
        private readonly ITagRepository _tagRepository;
        private readonly IBlogRepository _blogRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<BlogTagService> _logger;

        public BlogTagService(
            ITagRepository tagRepository,
            IBlogRepository blogRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ILogger<BlogTagService> logger)
        {
            _tagRepository = tagRepository;
            _blogRepository = blogRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<BlogTagDto>> GetAllAsync()
        {
            try
            {
                var blogTags = await _unitOfWork.BlogTagRepository.GetAllAsync();
                return blogTags.Select(bt => new BlogTagDto
                {
                    BlogId = bt.BlogId,
                    TagId = bt.TagId,
                    BlogTitle = bt.Blog?.Title ?? "Unknown",
                    TagName = bt.Tag?.Name ?? "Unknown"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all blog tags");
                throw;
            }
        }

        public async Task<BlogTagDto?> GetByIdAsync(string blogId, string tagId)
        {
            try
            {
                var blogTag = await _unitOfWork.BlogTagRepository.GetByBlogAndTagAsync(blogId, tagId);
                if (blogTag == null)
                {
                    return null;
                }

                return new BlogTagDto
                {
                    BlogId = blogTag.BlogId,
                    TagId = blogTag.TagId,
                    BlogTitle = blogTag.Blog?.Title ?? "Unknown",
                    TagName = blogTag.Tag?.Name ?? "Unknown"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting blog tag by id: BlogId={BlogId}, TagId={TagId}", blogId, tagId);
                throw;
            }
        }

        public async Task<BlogTagDto> CreateAsync(CreateBlogTagDto dto)
        {
            try
            {
                // Kiểm tra blog và tag có tồn tại không
                var blog = await _blogRepository.GetByIdAsync(dto.BlogId);
                var tag = await _tagRepository.GetByIdAsync(dto.TagId);

                if (blog == null)
                {
                    throw new InvalidOperationException($"Blog với ID '{dto.BlogId}' không tồn tại");
                }

                if (tag == null)
                {
                    throw new InvalidOperationException($"Tag với ID '{dto.TagId}' không tồn tại");
                }

                // Kiểm tra blog tag đã tồn tại chưa
                var existingBlogTag = await _unitOfWork.BlogTagRepository.GetByBlogAndTagAsync(dto.BlogId, dto.TagId);
                if (existingBlogTag != null)
                {
                    throw new InvalidOperationException($"Blog tag đã tồn tại");
                }

                // Tạo blog tag mới
                var blogTag = new BlogTag
                {
                    BlogId = dto.BlogId,
                    TagId = dto.TagId
                };

                await _unitOfWork.BlogTagRepository.AddAsync(blogTag);
                await _unitOfWork.SaveChangesAsync();

                return new BlogTagDto
                {
                    BlogId = blogTag.BlogId,
                    TagId = blogTag.TagId,
                    BlogTitle = blog.Title,
                    TagName = tag.Name
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating blog tag");
                throw;
            }
        }

        public async Task<bool> DeleteAsync(string blogId, string tagId)
        {
            try
            {
                var blogTag = await _unitOfWork.BlogTagRepository.GetByBlogAndTagAsync(blogId, tagId);
                if (blogTag == null)
                {
                    return false;
                }

                _unitOfWork.BlogTagRepository.Remove(blogTag);
                return await _unitOfWork.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting blog tag: BlogId={BlogId}, TagId={TagId}", blogId, tagId);
                throw;
            }
        }

        public async Task<IEnumerable<BlogTagDto>> GetByBlogIdAsync(string blogId)
        {
            try
            {
                var blogTags = await _unitOfWork.BlogTagRepository.GetByBlogIdAsync(blogId);
                return blogTags.Select(bt => new BlogTagDto
                {
                    BlogId = bt.BlogId,
                    TagId = bt.TagId,
                    BlogTitle = bt.Blog?.Title ?? "Unknown",
                    TagName = bt.Tag?.Name ?? "Unknown"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting blog tags by blog id: {BlogId}", blogId);
                throw;
            }
        }

        public async Task<IEnumerable<BlogTagDto>> GetByTagIdAsync(string tagId)
        {
            try
            {
                var blogTags = await _unitOfWork.BlogTagRepository.GetByTagIdAsync(tagId);
                return blogTags.Select(bt => new BlogTagDto
                {
                    BlogId = bt.BlogId,
                    TagId = bt.TagId,
                    BlogTitle = bt.Blog?.Title ?? "Unknown",
                    TagName = bt.Tag?.Name ?? "Unknown"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting blog tags by tag id: {TagId}", tagId);
                throw;
            }
        }

        public async Task<bool> AddTagsToBlogAsync(string blogId, List<string> tagIds)
        {
            try
            {
                var blog = await _blogRepository.GetByIdAsync(blogId);
                if (blog == null)
                {
                    return false;
                }

                foreach (var tagId in tagIds)
                {
                    var tag = await _tagRepository.GetByIdAsync(tagId);
                    if (tag != null)
                    {
                        var existingBlogTag = await _unitOfWork.BlogTagRepository.GetByBlogAndTagAsync(blogId, tagId);
                        if (existingBlogTag == null)
                        {
                            var blogTag = new BlogTag
                            {
                                BlogId = blogId,
                                TagId = tagId
                            };
                            await _unitOfWork.BlogTagRepository.AddAsync(blogTag);
                        }
                    }
                }

                return await _unitOfWork.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding tags to blog: {BlogId}", blogId);
                throw;
            }
        }

        public async Task<bool> RemoveTagsFromBlogAsync(string blogId, List<string> tagIds)
        {
            try
            {
                foreach (var tagId in tagIds)
                {
                    var blogTag = await _unitOfWork.BlogTagRepository.GetByBlogAndTagAsync(blogId, tagId);
                    if (blogTag != null)
                    {
                        _unitOfWork.BlogTagRepository.Remove(blogTag);
                    }
                }

                return await _unitOfWork.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing tags from blog: {BlogId}", blogId);
                throw;
            }
        }
    }
} 