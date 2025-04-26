using back_end.DTO.UserDTOModel;
using back_end.Enity;
using back_end.Service.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private IRoleService _roleService;

        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }
        [HttpGet]
        public async Task<IActionResult> GetRoles()
        {
            var data = await _roleService.GetRoles();
            return Ok(data);
        }
        [HttpPost]
        public async Task<IActionResult> AddRole([FromBody] RoleDTO role)
        {
            var data = await _roleService.AddRole(role);
            return Ok(data);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateRole([FromBody] Role role)
        {
            var data = await _roleService.UpdateRole(role);
            return Ok(data);
        }



        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(Guid id)
        {
            var data = await _roleService.DeleteRole(id);
            return Ok(data);
        }

        [HttpPost]
        [Route("assign-role")]
        public async Task<IActionResult> AssignRole([FromBody] UserRoleDTO userRole)
        {
            var data = await _roleService.AssignRole(userRole);
            return Ok(data);
        }

        [HttpGet]
        [Route("user-role")]
        public async Task<IActionResult> GetUserRole()
        {
            var data = await _roleService.GetAllUserRole();
            return Ok(data);
        }
        [HttpDelete]
        [Route("user-role/{id}")]
        public async Task<IActionResult> DeleteUserRole(Guid id)
        {
            var data = await _roleService.DeleteUserRole(id);
            return Ok(data);
        }

    }
}
