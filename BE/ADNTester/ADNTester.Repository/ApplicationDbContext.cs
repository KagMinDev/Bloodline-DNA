using ADNTester.BO;
using ADNTester.BO.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Repository
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<TestService> TestServices { get; set; }
        public DbSet<ServicePrice> ServicePrices { get; set; }
        public DbSet<TestBooking> TestBookings { get; set; }
        public DbSet<TestKit> TestKits { get; set; }
        public DbSet<TestSample> TestSamples { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<BlogTag> BlogTags {  get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<SampleTypeInstruction> SampleTypeInstructions { get; set; }
        public DbSet<OtpCode> OtpCodes { get; set; }
        public DbSet<LogisticsInfo> LogisticsInfos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // BaseEntity: cấu hình CreatedAt và UpdatedAt mặc định (nếu có)
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
                {
                    modelBuilder.Entity(entityType.ClrType).Property(nameof(BaseEntity.CreatedAt))
                        .HasDefaultValueSql("GETUTCDATE()");

                    modelBuilder.Entity(entityType.ClrType).Property(nameof(BaseEntity.UpdatedAt))
                        .HasDefaultValueSql("GETUTCDATE()");
                }
            }

            // User - TestBooking (1 User - N Bookings)
            modelBuilder.Entity<TestBooking>()
                .HasOne(b => b.Client)
                .WithMany(u => u.Bookings)
                .HasForeignKey(b => b.ClientId)
                .OnDelete(DeleteBehavior.Restrict);

            // TestService - TestBooking (1 Service - N Bookings)
            modelBuilder.Entity<TestBooking>()
                .HasOne(b => b.TestService)
                .WithMany(s => s.Bookings)
                .HasForeignKey(b => b.TestServiceId)
                .OnDelete(DeleteBehavior.Restrict);

            // TestService - TestServicePrice (1 Service - N Prices)
            modelBuilder.Entity<ServicePrice>()
                .HasOne(p => p.Service)
                .WithMany(s => s.Prices)
                .HasForeignKey(p => p.ServiceId)
                .OnDelete(DeleteBehavior.Cascade);

            // TestKit - TestBooking (1-1)
            modelBuilder.Entity<TestKit>()
                .HasOne(k => k.Booking)
                .WithOne(b => b.Kit)
                .HasForeignKey<TestKit>(k => k.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

            // TestSample - TestKit (1 Kit - N Samples)
            modelBuilder.Entity<TestSample>()
                .HasOne(s => s.Kit)
                .WithMany(k => k.Samples)
                .HasForeignKey(s => s.KitId)
                .OnDelete(DeleteBehavior.Cascade);

            // TestSample - User (Collector, nullable)
            modelBuilder.Entity<TestSample>()
                .HasOne(s => s.Collector)
                .WithMany()
                .HasForeignKey(s => s.CollectedById)
                .OnDelete(DeleteBehavior.SetNull);

            //Blog - Tag (N Blog - N Tag)
            modelBuilder.Entity<BlogTag>()
                .HasKey(bt => new { bt.BlogId, bt.TagId });

            modelBuilder.Entity<BlogTag>()
                .HasOne(bt => bt.Blog)
                .WithMany(b => b.Tags)
                .HasForeignKey(bt => bt.BlogId);

            modelBuilder.Entity<BlogTag>()
                .HasOne(bt => bt.Tag)
                .WithMany(b => b.BlogTags)
                .HasForeignKey(bt => bt.TagId);

            // Enum conversions to string
            modelBuilder.Entity<TestSample>()
                .Property(s => s.SampleType)
                .HasConversion<string>()
                .HasMaxLength(50);

            modelBuilder.Entity<TestSample>()
                .Property(s => s.RelationshipToSubject)
                .HasConversion<string>()
                .HasMaxLength(50);

            modelBuilder.Entity<TestBooking>()
                .Property(b => b.Status)
                .HasConversion<string>()
                .HasMaxLength(50);

            modelBuilder.Entity<TestService>()
                .Property(s => s.Type)
                .HasConversion<string>()
                .HasMaxLength(50);

            modelBuilder.Entity<ServicePrice>()
                .Property(p => p.CollectionMethod)
                .HasConversion<string>()
                .HasMaxLength(50);

            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>()
                .HasMaxLength(30);

            modelBuilder.Entity<Blog>()
                .Property(b => b.Status)
                .HasConversion<string>()
                .HasMaxLength(30);

            modelBuilder.Entity<TestService>()
                .Property(x => x.IsActive)
                .HasDefaultValue(true);
            // LogisticsInfo config
            modelBuilder.Entity<LogisticsInfo>(entity =>
            {
                entity.HasKey(l => l.Id);
                entity.Property(l => l.Id).ValueGeneratedNever(); // Do not let DB auto-generate
            });
            modelBuilder.Entity<LogisticsInfo>()
                .Property(l => l.Type)
                .HasConversion<string>()
                .HasMaxLength(30);// store enum as string

            // TestKit config
            modelBuilder.Entity<TestKit>(entity =>
            {
                entity.HasOne(t => t.DeliveryInfo)
                      .WithMany() // Not a 2-way navigation
                      .HasForeignKey(t => t.DeliveryInfoId)
                      .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(t => t.PickupInfo)
                      .WithMany()
                      .HasForeignKey(t => t.PickupInfoId)
                      .OnDelete(DeleteBehavior.NoAction);
            });

        }
    }
}
