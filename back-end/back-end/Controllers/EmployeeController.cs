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
    [Authorize(Roles ="manager")]
    public class EmployeeController : ControllerBase
    {
        private IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _employeeService.GetAll();
            return Ok(data);
        }


        [HttpPost]
        public async Task<IActionResult> Create([FromBody] EmployeeDTO employee)
        {
            var data = await _employeeService.Create(employee);
            return Ok(data);
        }

        [HttpPut]
        [AllowAnonymous]
        public async Task<IActionResult> Update([FromBody] EmployeeDTO employee)
        {
            var data = await _employeeService.Update(employee);
            return Ok(data);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var data = await _employeeService.Delete(id);
            return Ok(data);
        }
    }
}
