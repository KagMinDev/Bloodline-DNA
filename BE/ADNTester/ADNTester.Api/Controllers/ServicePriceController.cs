using ADNTester.BO.DTOs;
using ADNTester.BO.DTOs.Common;
using ADNTester.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADNTester.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ServicePriceController : ControllerBase
    {
        private readonly IServicePriceService _servicePriceService;

        public ServicePriceController(IServicePriceService servicePriceService)
        {
            _servicePriceService = servicePriceService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PriceServiceDto>>> GetAll()
        {
            var prices = await _servicePriceService.GetAllAsync();
            return Ok(new ApiResponse<IEnumerable<PriceServiceDto>>(prices, "Lấy danh sách giá dịch vụ thành công"));
        }

        [HttpGet("service/{serviceId}")]
        public async Task<ActionResult<IEnumerable<PriceServiceDto>>> GetByServiceId(string serviceId)
        {
            var prices = await _servicePriceService.GetByServiceIdAsync(serviceId);
            return Ok(new ApiResponse<IEnumerable<PriceServiceDto>>(prices, "Lấy danh sách giá theo dịch vụ thành công"));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PriceServiceDto>> GetById(string id)
        {
            var price = await _servicePriceService.GetByIdAsync(id);
            if (price == null)
                return NotFound(new ApiResponse<string>("Không tìm thấy giá dịch vụ", 404));

            return Ok(new ApiResponse<PriceServiceDto>(price, "Thông tin giá dịch vụ"));
        }

        [HttpPost]
        public async Task<ActionResult<string>> Create(CreatePriceServiceDto dto)
        {
            var id = await _servicePriceService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id }, new ApiResponse<string>(id, "Tạo giá dịch vụ thành công", 201));
        }

        [HttpPut]
        public async Task<IActionResult> Update(UpdatePriceServiceDto dto)
        {
            var result = await _servicePriceService.UpdateAsync(dto);
            if (!result)
                return NotFound(new ApiResponse<string>("Không tìm thấy giá dịch vụ để cập nhật", 404));

            return Ok(new ApiResponse<string>(dto.Id, "Cập nhật giá dịch vụ thành công"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _servicePriceService.DeleteAsync(id);
            if (!result)
                return NotFound(new ApiResponse<string>("Không tìm thấy giá dịch vụ để xóa", 404));

            return Ok(new ApiResponse<string>(id, "Xóa giá dịch vụ thành công"));
        }
    }
} 