using back_end.DTO.UserDTOModel;
using back_end.Enity;
using back_end.Models.Response;

namespace back_end.Service.Interface
{
    public interface IRoleService
    {
        Task<AppResponse<Role>> AddRole(RoleDTO data);
        Task<AppResponse<List<Role>>> GetRoles();
        Task<AppResponse<Role>> UpdateRole(Role data);
        Task<AppResponse<Role>> DeleteRole(Guid roleId);
        Task<AppResponse<UserRole>> AssignRole(UserRoleDTO userRole);
        Task<AppResponse<List<UserRoleDTO>>> GetAllUserRole();
        Task<AppResponse<UserRoleDTO>> DeleteUserRole(Guid userRole);
    }
}
