using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.Enums
{
    public enum RelationshipToSubject
    {
        Unknown = 0,

        Father = 1,
        Mother = 2,
        Child = 3,

        Grandfather = 4,
        Grandmother = 5,
        Grandchild = 6,

        Brother = 7,
        Sister = 8,

        Uncle = 9,
        Aunt = 10,
        Nephew = 11,
        Niece = 12,

        Other = 99
    }

}
