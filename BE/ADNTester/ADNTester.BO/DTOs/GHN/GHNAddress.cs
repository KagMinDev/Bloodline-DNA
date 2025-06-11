using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADNTester.BO.DTOs.GHN
{
    public class GHNAddress
    {
        public class GhnProvinceResponse { public List<GhnProvince> data { get; set; } }

        public class GhnDistrictResponse { public List<GhnDistrict> data { get; set; } }

        public class GhnWardResponse { public List<GhnWard> data { get; set; } }

        public class GhnProvince { 
            public int ProvinceID { get; set; } 
            public string ProvinceName { get; set; } 
        }

        public class GhnDistrict { 
            public int DistrictID { get; set; } 
            public string DistrictName { get; set; } 
        }
        
        public class GhnWard { 
            public string WardCode { get; set; } 
            public string WardName { get; set; } 
        }

    }
}
