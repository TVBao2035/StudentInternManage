using back_end.DTO;
using back_end.Enity;
using back_end.Service.Implement;
using back_end.Service.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AssignmentController : ControllerBase
    {
        private IAssignmentService _assignmentService;

        public AssignmentController(IAssignmentService assignmentService)
        {
            _assignmentService = assignmentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _assignmentService.GetAll();
            return Ok(data);
        }


        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AssignmentDTO assignment)
        {
            var data = await _assignmentService.Create(assignment);
            return Ok(data);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] AssignmentDTO assignment)
        {
            var data = await _assignmentService.Update(assignment);
            return Ok(data);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var data = await _assignmentService.Delete(id);
            return Ok(data);
        }

    }
}
