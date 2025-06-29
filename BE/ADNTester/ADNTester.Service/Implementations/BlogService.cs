using ADNTester.BO.DTOs;
using ADNTester.BO.Entities;
using ADNTester.Repository.Interfaces;
using ADNTester.Service.Interfaces;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace ADNTester.Service.Implementations
{
    public class BlogService : IBlogService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ITagService _tagService;
        private readonly ICloudinaryService _cloudinaryService;

        public BlogService(IUnitOfWork unitOfWork, IMapper mapper, ITagService tagService, ICloudinaryService cloudinaryService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _tagService = tagService;
            _cloudinaryService = cloudinaryService;
        }

        public async Task<IEnumerable<BlogDto>> GetAllAsync()
        {
            var blogs = await _unitOfWork.IBlogRepository.GetAllAsync();
            var blogDtos = new List<BlogDto>();
            
            foreach (var blog in blogs)
            {
                blog.Author = await _unitOfWork.UserRepository.GetByIdAsync(blog.AuthorId);
                var blogDto = _mapper.Map<BlogDto>(blog);
                var tags = await _tagService.GetTagsByBlogIdAsync(blog.Id);
                blogDto.Tags = tags.ToList();
                blogDtos.Add(blogDto);
            }
            
            return blogDtos;
        }

        public async Task<BlogDto> GetByIdAsync(string id)
        {
            var blog = await _unitOfWork.IBlogRepository.GetByIdAsync(id);
            if (blog == null)
                return null;

            blog.Author = await _unitOfWork.UserRepository.GetByIdAsync(blog.AuthorId);
            var blogDto = _mapper.Map<BlogDto>(blog);
            var tags = await _tagService.GetTagsByBlogIdAsync(blog.Id);
            blogDto.Tags = tags.ToList();
            return blogDto;
        }

        public async Task<IEnumerable<BlogDto>> GetByTagIdAsync(string tagId)
        {
            var blogTags = await _unitOfWork.BlogTagRepository.GetByTagIdAsync(tagId);
            var blogIds = blogTags.Select(bt => bt.BlogId).Distinct().ToList();
            var blogs = new List<BlogDto>();
            
            foreach (var blogId in blogIds)
            {
                var blog = await _unitOfWork.IBlogRepository.GetByIdAsync(blogId);
                if (blog != null)
                {
                    blog.Author = await _unitOfWork.UserRepository.GetByIdAsync(blog.AuthorId);
                    var blogDto = _mapper.Map<BlogDto>(blog);
                    var tags = await _tagService.GetTagsByBlogIdAsync(blog.Id);
                    blogDto.Tags = tags.ToList();
                    blogs.Add(blogDto);
                }
            }
            
            return blogs;
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

            // Update basic blog information
            _mapper.Map(dto, blog);
            _unitOfWork.IBlogRepository.Update(blog);

            // Handle tag updates
            if (dto.TagIds != null)
            {
                // Remove existing blog tags
                await _unitOfWork.BlogTagRepository.RemoveByBlogIdAsync(blog.Id);

                // Add new blog tags
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
            }

            return await _unitOfWork.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateWithFileAsync(UpdateBlogWithFileDto dto)
        {
            var blog = await _unitOfWork.IBlogRepository.GetByIdAsync(dto.Id);
            if (blog == null)
                return false;

            // Upload new image if provided
            if (dto.ThumbnailURL != null)
            {
                var imageUrl = await _cloudinaryService.UploadImageAsync(dto.ThumbnailURL, "blogs");
                blog.ThumbnailURL = imageUrl;
            }

            // Update other blog information
            blog.Title = dto.Title;
            blog.Content = dto.Content;
            blog.Status = dto.Status;
            _unitOfWork.IBlogRepository.Update(blog);

            // Handle tag updates
            if (dto.TagIds != null)
            {
                // Remove existing blog tags
                await _unitOfWork.BlogTagRepository.RemoveByBlogIdAsync(blog.Id);

                // Add new blog tags
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
            }

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

        public async Task<bool> AddTagsToBlogAsync(AddTagsToBlogDto dto)
        {
            var blog = await _unitOfWork.IBlogRepository.GetByIdAsync(dto.BlogId);
            if (blog == null)
                return false;

            // Lấy các tag đã có của blog
            var existingBlogTags = await _unitOfWork.BlogTagRepository.GetByBlogIdAsync(dto.BlogId);
            var existingTagIds = existingBlogTags.Select(bt => bt.TagId).ToHashSet();

            bool added = false;
            foreach (var tagId in dto.TagIds)
            {
                if (!existingTagIds.Contains(tagId))
                {
                    var tag = await _unitOfWork.TagRepository.GetByIdAsync(tagId);
                    if (tag != null)
                    {
                        var blogTag = new BlogTag
                        {
                            BlogId = dto.BlogId,
                            TagId = tagId
                        };
                        await _unitOfWork.BlogTagRepository.AddAsync(blogTag);
                        added = true;
                    }
                }
            }
            if (added)
                return await _unitOfWork.SaveChangesAsync() > 0;
            return true;
        }
    }
} 