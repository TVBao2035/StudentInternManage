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

    public class TechnologyController : ControllerBase
    {
        private ITechnologyService _technologyService;

        public TechnologyController(ITechnologyService technologyService)
        {
            _technologyService = technologyService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var data = await _technologyService.GetAll();
            return Ok(data);
        }

        [HttpPost]
        [Authorize(Roles = "business")]
        public async Task<IActionResult> Create([FromBody]TechnologyDTO technology)
        {
            var data = await _technologyService.Create(technology);
            return Ok(data);
        }

        [HttpPut]
        [Authorize(Roles = "business")]
        public async Task<IActionResult> Update([FromBody]TechnologyDTO technology)
        {
            var data = await _technologyService.Update(technology);
            return Ok(data);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "business")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var data = await _technologyService.Delete(id);
            return Ok(data);
        }
    }
}
