using back_end.DTO;
using back_end.Models.Request;
using back_end.Service.Implement;
using back_end.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [Route("[controller]")]
    [ApiController]


    public class EmployeeController : ControllerBase
    {
        private IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }
        [HttpPost]
        [Route("Search")]
        [Authorize(Roles = "manager")]
        public async Task<IActionResult> Search([FromBody] SearchRequest request)
        {
            var data = await _employeeService.Search(request);
            return Ok(data);
        }
        [HttpGet]
        [Authorize(Roles = "manager")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _employeeService.GetAll();
            return Ok(data);
        }
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(Guid id)
        {
            var data = await _employeeService.GetById(id);
            return Ok(data);
        }
        [HttpPost]
        [Authorize(Roles = "manager")]
        public async Task<IActionResult> Create([FromBody] EmployeeDTO employee)
        {
            var data = await _employeeService.Create(employee);
            return Ok(data);
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> Update([FromBody] EmployeeDTO employee)
        {
            var data = await _employeeService.Update(employee);
            return Ok(data);
        }

        [HttpGet]
        [Route("Intern")]
        [Authorize(Roles = "manager")]
        public async Task<IActionResult> GetInterns()
        {
            var data = await _employeeService.GetInterns();
            return Ok(data);
        }
        [HttpGet]
        [Route("InternNotAssign")]
        [Authorize(Roles = "manager")]
        public async Task<IActionResult> GetInternNotAssigned()
        {
            var data = await _employeeService.GetInternsNotAssigned();
            return Ok(data);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "manager")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var data = await _employeeService.Delete(id);
            return Ok(data);
        }
    }
}
