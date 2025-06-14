using ADNTester.BO.DTOs.GHN;
using ADNTester.Service.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using static ADNTester.BO.DTOs.GHN.GHNAddress;
using static ADNTester.BO.DTOs.GHN.GHNRequest;
using static ADNTester.BO.DTOs.GHN.GHNResponse;

namespace ADNTester.Service.Implementations
{
    public class GHNService : IGHNService
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _config;
        public GHNService(IHttpClientFactory factory, IConfiguration config)
        {
            _client = factory.CreateClient("GHN");
            _config = config;
        }
        #region Address Code
        public async Task<List<GhnProvince>> GetProvincesAsync()
        {
            AddHeaders();
            var response = await _client.GetAsync("public-api/master-data/province");
            var result = await response.Content.ReadFromJsonAsync<GhnProvinceResponse>();
            return result?.data ?? new();
        }

        public async Task<List<GhnDistrict>> GetDistrictsAsync(int provinceId)
        {
            AddHeaders();
            var body = new { province_id = provinceId };
            var response = await _client.PostAsJsonAsync("public-api/master-data/district", body);
            var result = await response.Content.ReadFromJsonAsync<GhnDistrictResponse>();
            return result?.data ?? new();
        }

        public async Task<List<GhnWard>> GetWardsAsync(int districtId)
        {
            AddHeaders();
            var body = new { district_id = districtId };
            var response = await _client.PostAsJsonAsync("public-api/master-data/ward", body);
            var result = await response.Content.ReadFromJsonAsync<GhnWardResponse>();
            return result?.data ?? new();
        }
        #endregion
        #region Lead time
        public async Task<GhnLeadTimeData?> GetLeadTimeAsync(GhnLeadTimeRequest request)
        {
            AddHeaders();

            var body = new
            {
                from_district_id = request.FromDistrictId,
                from_ward_code = request.FromWardCode,
                to_district_id = request.ToDistrictId,
                to_ward_code = request.ToWardCode,
                service_id = request.ServiceId
            };

            var response = await _client.PostAsJsonAsync("public-api/v2/shipping-order/leadtime", body);
            if (!response.IsSuccessStatusCode) return null;

            var jsonString = await response.Content.ReadAsStringAsync();
            Console.WriteLine(jsonString); // Hoặc debug breakpoint

            var result = await response.Content.ReadFromJsonAsync<GhnLeadTimeResponse>();
            if (result?.Data == null) return null;

            return result.Data;
        }

        #endregion
        #region Order
        public async Task<List<GhnService>> GetAvailableServicesAsync(int fromDistrictId, int toDistrictId)
        {
            AddHeaders();

            var body = new
            {
                shop_id = int.Parse(_config["GHN:ShopId"]!),
                from_district = fromDistrictId,
                to_district = toDistrictId
            };

            var response = await _client.PostAsJsonAsync("public-api/v2/shipping-order/available-services", body);
            if (!response.IsSuccessStatusCode) return new();

            var result = await response.Content.ReadFromJsonAsync<GhnServiceResponse>();
            return result?.data ?? new();
        }

        public async Task<GhnCreateOrderData?> CreateShippingOrderAsync(GhnCreateOrderRequest request)
        {
            AddHeaders(); // Thêm token & shopId vào header

            var response = await _client.PostAsJsonAsync("public-api/v2/shipping-order/create", request);

            var raw = await response.Content.ReadAsStringAsync();
            Console.WriteLine("GHN Create Order Response: " + raw);

            if (!response.IsSuccessStatusCode) return null;

            var result = JsonSerializer.Deserialize<GhnCreateOrderResponse>(raw, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return result?.Data;
        }

        #endregion
        #region Fee
        public async Task<GhnFeeData> CalculateShippingFeeAsync(GhnShippingFeeRequest request)
        {
            AddHeaders();

            var requestBody = new
            {
                from_district_id = request.FromDistrictId,
                to_district_id = request.ToDistrictId,
                from_ward_code = request.FromWardCode,
                to_ward_code = request.ToWardCode,
                service_id = request.ServiceId,
                weight = request.Weight,
                height = request.Height,
                length = request.Length,
                width = request.Width
            };


            var response = await _client.PostAsJsonAsync("public-api/v2/shipping-order/fee", requestBody);
            var content = await response.Content.ReadAsStringAsync();
            Console.WriteLine(content); // Log ra để xem lỗi chi tiết từ GHN

            var result = await response.Content.ReadFromJsonAsync<GhnFeeResponse>();
            return result?.Data;
        }

        #endregion
        #region Helper methods
        private void AddHeaders()
        {
            _client.DefaultRequestHeaders.Clear();
            _client.DefaultRequestHeaders.Add("Token", _config["GHN:Token"]);
            _client.DefaultRequestHeaders.Add("ShopId", _config["GHN:ShopId"]);
        }
        #endregion
    }
}
