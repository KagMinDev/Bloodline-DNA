using ADNTester.BO.Entities;
using ADNTester.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.Repository.Implementations
{
    public class SampleInstructionRepository : GenericRepository<SampleTypeInstruction>,ISampleInstructionRepository
    {
        public SampleInstructionRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
