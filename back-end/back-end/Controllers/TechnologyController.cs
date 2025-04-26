using back_end.DTO;
using back_end.Enity;
using back_end.Service.Implement;
using back_end.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles ="business")]
    public class TechnologyController : ControllerBase
    {
        private ITechnologyService _technologyService;

        public TechnologyController(ITechnologyService technologyService)
        {
            _technologyService = technologyService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _technologyService.GetAll();
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody]TechnologyDTO technology)
        {
            var data = await _technologyService.Create(technology);
            return Ok(data);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody]TechnologyDTO technology)
        {
            var data = await _technologyService.Update(technology);
            return Ok(data);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var data = await _technologyService.Delete(id);
            return Ok(data);
        }
    }
}
