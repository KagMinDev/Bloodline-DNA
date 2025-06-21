using ADNTester.Repository.Interfaces;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Repository.Implementations
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private IDbContextTransaction? _transaction;

        public IBlogRepository IBlogRepository { get; }
        public IFeedbackRepository FeedbackRepository { get; }
        public IServicePriceRepository ServicePriceRepository { get; }
        public ITagRepository TagRepository { get; }
        public IBlogTagRepository BlogTagRepository { get; }
        public ITestBookingRepository TestBookingRepository { get; }
        public ITestKitRepository TestKitRepository { get; }
        public ITestResultRepository TestResultRepository { get; }
        public ITestSampleRepository TestSampleRepository { get; }
        public ITestServiceRepository TestServiceRepository { get; }
        public IUserRepository UserRepository { get; }
        public ISampleInstructionRepository SampleInstructionRepository { get; }
        public IPaymentRepository PaymentRepository { get; }
        public IOtpRepository OtpRepository { get; }
        public ILogisticInfoRepository LogisticInfoRepository { get; }
        public UnitOfWork(
            ApplicationDbContext context,
            IBlogRepository blogRepository,
            IFeedbackRepository feedbackRepository,
            IServicePriceRepository servicePriceRepository,
            ITagRepository tagRepository,
            IBlogTagRepository blogTagRepository,
            ITestBookingRepository testBookingRepository,
            ITestKitRepository testKitRepository,
            ITestResultRepository testResultRepository,
            ITestSampleRepository testSampleRepository,
            ITestServiceRepository testServiceRepository,
            IUserRepository userRepository,
            ISampleInstructionRepository sampleInstructionRepository,
            IPaymentRepository paymentRepository,
            IOtpRepository otpRepository,
            ILogisticInfoRepository logisticInfoRepository)
        {
            _context = context;
            IBlogRepository = blogRepository;
            FeedbackRepository = feedbackRepository;
            ServicePriceRepository = servicePriceRepository;
            TagRepository = tagRepository;
            BlogTagRepository = blogTagRepository;
            TestBookingRepository = testBookingRepository;
            TestKitRepository = testKitRepository;
            TestResultRepository = testResultRepository;
            TestSampleRepository = testSampleRepository;
            TestServiceRepository = testServiceRepository;
            UserRepository = userRepository;
            SampleInstructionRepository = sampleInstructionRepository;
            PaymentRepository = paymentRepository;
            OtpRepository = otpRepository;
            LogisticInfoRepository = logisticInfoRepository;
        }

        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitAsync()
        {
            await _context.SaveChangesAsync();
            if (_transaction != null)
            {
                await _transaction.CommitAsync();
                await _transaction.DisposeAsync();
            }
        }

        public async Task RollbackAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
            }
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
