using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static ADNTester.BO.DTOs.GHN.GHNAddress;
using static ADNTester.BO.DTOs.GHN.GHNRequest;
using static ADNTester.BO.DTOs.GHN.GHNResponse;

namespace ADNTester.Service.Interfaces
{
    public interface IGHNService
    {
        Task<GhnFeeData> CalculateShippingFeeAsync(GhnShippingFeeRequest request);
        //Task<string> CreateShippingOrderAsync(GhnCreateOrderRequest order);
        Task<List<GhnProvince>> GetProvincesAsync();
        Task<List<GhnDistrict>> GetDistrictsAsync(int provinceId);
        Task<List<GhnWard>> GetWardsAsync(int districtId);
        Task<List<GhnService>> GetAvailableServicesAsync(int fromDistrictId, int toDistrictId);
        Task<GhnLeadTimeData?> GetLeadTimeAsync(GhnLeadTimeRequest request);
        Task<GhnCreateOrderData?> CreateShippingOrderAsync(GhnCreateOrderRequest request);
    }
}
