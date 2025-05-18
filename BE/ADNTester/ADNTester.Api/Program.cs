using ADNTester.Repository;
using ADNTester.Service;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DockerConnection")));

builder.Services.AddRepositoryDependencies();
builder.Services.AddServiceDependencies();

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(8080); // HTTP port

    options.ListenAnyIP(8081, listenOptions =>
    {
        listenOptions.UseHttps("/app/https/aspnetapp.pfx", Environment.GetEnvironmentVariable("CERT_PASSWORD"));
    });

});
var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    var retryCount = 0;
    const int maxRetries = 10;

    while (retryCount < maxRetries)
    {
        try
        {
            db.Database.Migrate();
            logger.LogInformation("Database migration successful.");
            break;
        }
        catch (Exception ex)
        {
            retryCount++;
            logger.LogWarning(ex, "Migration attempt {RetryCount} failed.", retryCount);

            if (retryCount >= maxRetries)
            {
                logger.LogError(ex, "Maximum retry attempts reached. Migration failed.");
                throw;
            }

            Thread.Sleep(10000); // đợi 10s rồi thử lại
        }
    }
}

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
app.UseSwagger();
    app.UseSwaggerUI();
//}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
