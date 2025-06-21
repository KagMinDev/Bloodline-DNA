using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Repository.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IBlogRepository IBlogRepository { get; }
        IFeedbackRepository FeedbackRepository { get; }
        IServicePriceRepository ServicePriceRepository { get; }
        ITagRepository TagRepository { get; }
        IBlogTagRepository BlogTagRepository { get; }
        ITestBookingRepository TestBookingRepository { get; }
        ITestKitRepository TestKitRepository { get; }
        ITestResultRepository TestResultRepository { get; }
        ITestSampleRepository TestSampleRepository { get; }
        ITestServiceRepository TestServiceRepository { get; }   
        IUserRepository UserRepository { get; }
        ISampleInstructionRepository SampleInstructionRepository { get; }
        IPaymentRepository PaymentRepository { get; }
        IOtpRepository OtpRepository { get; }
        Task BeginTransactionAsync();
        Task CommitAsync();
        Task RollbackAsync();
        Task<int> SaveChangesAsync();
    }
}
