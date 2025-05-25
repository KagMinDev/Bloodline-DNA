using ADNTester.BO.DTOs;
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
            return Ok(prices);
        }

        [HttpGet("service/{serviceId}")]
        public async Task<ActionResult<IEnumerable<PriceServiceDto>>> GetByServiceId(string serviceId)
        {
            var prices = await _servicePriceService.GetByServiceIdAsync(serviceId);
            return Ok(prices);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PriceServiceDto>> GetById(string id)
        {
            var price = await _servicePriceService.GetByIdAsync(id);
            if (price == null)
                return NotFound();

            return Ok(price);
        }

        [HttpPost]
        public async Task<ActionResult<string>> Create(CreatePriceServiceDto dto)
        {
            var id = await _servicePriceService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        [HttpPut]
        public async Task<IActionResult> Update(UpdatePriceServiceDto dto)
        {
            var result = await _servicePriceService.UpdateAsync(dto);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _servicePriceService.DeleteAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
} 