using back_end.DTO;
using back_end.Service.Implement;
using back_end.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class JobController : ControllerBase
    {
        private IJobService _jobService;

        public JobController(IJobService jobService)
        {
            _jobService = jobService;
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(Guid id)
        {
            var data = await _jobService.GetById(id);
            return Ok(data);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(JobDTO job)
        {
            var data = await _jobService.Create(job);
            return Ok(data);
        }


        [HttpGet]
        [Authorize(Roles = "manager")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _jobService.GetAll();
            return Ok(data);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(Guid id)
        {
            var data = await _jobService.Delete(id);
            return Ok(data);
        }

        [HttpPut]
        [Authorize(Roles = "manager")]
        public async Task<IActionResult> Update(JobDTO job)
        {
            var data = await _jobService.Update(job);
            return Ok(data);
        }
    }
}
