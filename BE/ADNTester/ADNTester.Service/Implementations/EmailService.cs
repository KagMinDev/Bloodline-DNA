using ADNTester.Service.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MimeKit;
using MailKit.Security;

namespace ADNTester.Service.Implementations
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task SendEmailAsync(string toEmail, string subject, string message)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(MailboxAddress.Parse("Ducvldse172482@fpt.edu.vn"));
            emailMessage.To.Add(new MailboxAddress("", toEmail));
            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart("html") { Text = message };

            var client = new MailKit.Net.Smtp.SmtpClient();
            {
                client.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                client.Authenticate("Ducvldse172482@fpt.edu.vn", "umnv fgro blxu ojvd");
                client.Send(emailMessage);
                client.Disconnect(true);


            }
        }
        public async Task SendOtpAsync(string toEmail, string otp)
        {
            var subject = "Mã xác thực OTP của bạn";
            var message = $@"
        <html>
            <body style='font-family: Arial, sans-serif;'>
                <h3>Xin chào,</h3>
                <p>Mã OTP của bạn là:</p>
                <h2 style='color: #2E86C1;'>{otp}</h2>
                <p>Vui lòng sử dụng mã này để hoàn tất quá trình xác thực. Mã sẽ hết hạn sau 5 phút.</p>
                <p>Trân trọng,<br/>ADNTester Team</p>
            </body>
        </html>
    ";

            await SendEmailAsync(toEmail, subject, message);
        }

    }

}
