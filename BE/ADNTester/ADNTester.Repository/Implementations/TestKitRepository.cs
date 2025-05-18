using ADNTester.BO.Entities;
using ADNTester.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Repository.Implementations
{
    public class TestKitRepository : GenericRepository<TestKit>, ITestKitRepository
    {
        public TestKitRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
