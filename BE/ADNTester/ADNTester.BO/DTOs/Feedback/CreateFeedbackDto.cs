namespace ADNTester.BO.DTOs
{
    public class CreateFeedbackDto
    {
        public string UserId { get; set; }
        public string TestServiceId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
    }
} 