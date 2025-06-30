using ADNTester.BO.Enums;
using ADNTester.BO.DTOs.Tag;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace ADNTester.BO.DTOs
{
    public class BlogDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string ThumbnailURL { get; set; }
        public string Status { get; set; }
        public string AuthorId { get; set; }
        public string AuthorName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<TagDto> Tags { get; set; } = new List<TagDto>();
    }

    public class CreateBlogDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public IFormFile ThumbnailURL { get; set; }
        public BlogStatus Status { get; set; }
        public string AuthorId { get; set; }
    }

    public class CreateBlogWithUrlDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string ThumbnailURL { get; set; }
        public BlogStatus Status { get; set; }
        public string AuthorId { get; set; }
    }

    public class CreateBlogWithTagsDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string ThumbnailURL { get; set; }
        public BlogStatus Status { get; set; }
        public string AuthorId { get; set; }
        public List<string> TagIds { get; set; } = new List<string>();
    }

    public class UpdateBlogDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string ThumbnailURL { get; set; }
        public BlogStatus Status { get; set; }
        public List<string> TagIds { get; set; } = new List<string>();
    }

    public class UpdateBlogWithFileDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public IFormFile ThumbnailURL { get; set; }
        public BlogStatus Status { get; set; }
        public List<string> TagIds { get; set; } = new List<string>();
    }

    public class AddTagsToBlogDto
    {
        public string BlogId { get; set; }
        public List<string> TagIds { get; set; } = new List<string>();
    }
} 