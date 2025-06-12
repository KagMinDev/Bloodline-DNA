using ADNTester.BO.DTOs.Common;
using ADNTester.Service.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static ADNTester.BO.DTOs.GHN.GHNAddress;
using static ADNTester.BO.DTOs.GHN.GHNRequest;
using static ADNTester.BO.DTOs.GHN.GHNResponse;

namespace ADNTester.Api.Controllers
{
    [ApiController]
    [Route("api/ghn")]
    public class GHNController : ControllerBase
    {
        private readonly IGHNService _ghnService;

        public GHNController(IGHNService ghnService)
        {
            _ghnService = ghnService;
        }

        /// <summary>
        /// Lấy danh sách tỉnh/thành phố từ GHN
        /// </summary>
        [HttpGet("provinces")]
        public async Task<IActionResult> GetProvinces()
        {
            var provinces = await _ghnService.GetProvincesAsync();
            return Ok(new ApiResponse<List<GhnProvince>>(provinces));
        }

        /// <summary>
        /// Lấy danh sách quận/huyện theo tỉnh
        /// </summary>
        [HttpGet("districts")]
        public async Task<IActionResult> GetDistricts([FromQuery] int provinceId)
        {
            var districts = await _ghnService.GetDistrictsAsync(provinceId);
            return Ok(new ApiResponse<List<GhnDistrict>>(districts));
        }

        /// <summary>
        /// Lấy danh sách phường/xã theo quận
        /// </summary>
        [HttpGet("wards")]
        public async Task<IActionResult> GetWards([FromQuery] int districtId)
        {
            var wards = await _ghnService.GetWardsAsync(districtId);
            return Ok(new ApiResponse<List<GhnWard>>(wards));
        }

        /// <summary>
        /// Lấy danh sách dịch vụ vận chuyển từ GHN
        /// </summary>
        [HttpGet("services")]
        public async Task<IActionResult> GetAvailableServices([FromQuery] int fromDistrictId, [FromQuery] int toDistrictId)
        {
            var services = await _ghnService.GetAvailableServicesAsync(fromDistrictId, toDistrictId);
            return Ok(new ApiResponse<List<GhnService>>(services));
        }

        /// <summary>
        /// Tính thời gian giao dự kiến (lead time)
        /// </summary>
        [HttpPost("leadtime")]
        public async Task<IActionResult> GetLeadTime([FromBody] GhnLeadTimeRequest request)
        {
            var leadTime = await _ghnService.GetLeadTimeAsync(request);
            return Ok(new ApiResponse<GhnLeadTimeData?>(leadTime));
        }

        /// <summary>
        /// Tính phí giao hàng
        /// </summary>
        [HttpPost("shipping-fee")]
        public async Task<IActionResult> CalculateShippingFee([FromBody] GhnShippingFeeRequest request)
        {
            var fee = await _ghnService.CalculateShippingFeeAsync(request);
            return Ok(new ApiResponse<GhnFeeData>(fee));
        }

        /// <summary>
        /// Tạo đơn giao hàng
        /// </summary>
        [HttpPost("create-order")]
        public async Task<IActionResult> CreateOrder([FromBody] GhnCreateOrderRequest request)
        {
            var result = await _ghnService.CreateShippingOrderAsync(request);
            if (result == null) return BadRequest("Tạo đơn hàng thất bại");
            return Ok(new ApiResponse<GhnCreateOrderData?>(result));
        }

    }
}