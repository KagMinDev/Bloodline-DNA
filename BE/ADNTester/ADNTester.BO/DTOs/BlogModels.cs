using ADNTester.BO.Enums;
using System;
using System.Collections.Generic;

namespace ADNTester.BO.DTOs
{
    public class BlogDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string ThumbnailURL { get; set; }
        public BlogStatus Status { get; set; }
        public string AuthorId { get; set; }
        public string AuthorName { get; set; }
        public List<string> TagIds { get; set; }
        public List<string> TagNames { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateBlogDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string ThumbnailURL { get; set; }
        public BlogStatus Status { get; set; }
        public string AuthorId { get; set; }
        public List<string> TagIds { get; set; }
    }

    public class UpdateBlogDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string ThumbnailURL { get; set; }
        public BlogStatus Status { get; set; }
        public List<string> TagIds { get; set; }
    }
} 