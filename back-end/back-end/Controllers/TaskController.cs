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
    public class TaskController : ControllerBase
    {
        private ITaskService _taskService;

        public TaskController(ITaskService taskService)
        {
            _taskService = taskService;
        }
        [HttpPost]
        [Authorize(Roles = "mentor")]
        public async Task<IActionResult> Create([FromBody] TaskDTO task)
        {
            var data = await _taskService.Create(task);
            return Ok(data);
        }
        [HttpGet]
        [Authorize(Roles = "mentor")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _taskService.GetAll();
            return Ok(data);
        }

        [HttpGet("assinment/{id}")]
        public async Task<IActionResult> GetTaskByAssignmentId(Guid id)
        {
            var data = await _taskService.GetTaskByAssignmentId(id);
            return Ok(data);
        }

        [HttpPut]
        [Authorize(Roles = "mentor")]
        public async Task<IActionResult> Update([FromBody] TaskDTO task)
        {
            var data = await _taskService.Update(task);
            return Ok(data);
        }

        [HttpPut]
        [Route("status")]
        [Authorize(Roles = "mentor")]
        public async Task<IActionResult> UpdateStatus([FromBody] TaskDTO task)
        {
            var data = await _taskService.UpdateStatus(task);
            return Ok(data);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "mentor")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var data = await _taskService.Delete(id);
            return Ok(data);
        }
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(Guid id)
        {
            var data = await _taskService.GetById(id);
            return Ok(data);
        }
        [HttpGet]
        [Route("intern")]
        [Authorize]
        public async Task<IActionResult> GetByInternId()
        {
            var data = await _taskService.GetByInternId();
            return Ok(data);
        }

    }
}
