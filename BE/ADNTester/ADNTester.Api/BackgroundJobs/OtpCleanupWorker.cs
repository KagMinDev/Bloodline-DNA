using ADNTester.Service.Interfaces;

namespace ADNTester.Api.BackgroundJobs
{
    public class OtpCleanupWorker : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<OtpCleanupWorker> _logger;
        private readonly TimeSpan _interval = TimeSpan.FromHours(24); // run each day once

        public OtpCleanupWorker(IServiceProvider serviceProvider, ILogger<OtpCleanupWorker> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var otpService = scope.ServiceProvider.GetRequiredService<IOtpService>();
                    var deletedCount = await otpService.CleanupExpiredOtpsAsync();

                    _logger.LogInformation("[OTP Cleanup] Deleted {Count} expired or used OTPs at {Time}", deletedCount, DateTime.UtcNow);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "[OTP Cleanup] An error occurred during cleanup");
                }

                await Task.Delay(_interval, stoppingToken);
            }
        }
    }
}
