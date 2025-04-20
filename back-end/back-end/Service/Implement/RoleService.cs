using AutoMapper;
using back_end.DTO.UserDTOModel;
using back_end.Enity;
using back_end.Models.Response;
using back_end.Respositories.Implement;
using back_end.Respositories.Interface;
using back_end.Service.Interface;
using Microsoft.EntityFrameworkCore;

namespace back_end.Service.Implement
{
    public class RoleService : IRoleService
    {
        private IMapper _mapper;
        private IRoleRespository _roleRespository;

        private IUserRespository _userRespository;
        private IUserRoleRespository _userRoleRespository;

        public RoleService(IRoleRespository roleRespository, 
            IMapper mapper, 
            IUserRespository userRespository, 
            IUserRoleRespository userRoleRespository)
        {
            _mapper = mapper;
            _roleRespository = roleRespository;
            _userRespository = userRespository;
            _userRoleRespository = userRoleRespository;
        }
        public async Task<AppResponse<Role>> AddRole(RoleDTO data)
        {
            var result = new AppResponse<Role>();
            try
            {
                var role = await _roleRespository.Queryable().Where(r => r.IsDelete == false).FirstOrDefaultAsync(r => r.Name.Equals(data.Name));
                if (role != null) return result.BuilderError("Role is existing");
                Role newRole = _mapper.Map<Role>(data);
                newRole.InitialEnity();
                await _roleRespository.Insert(newRole);
                return result.BuilderResult(newRole, "Creating Role Success");

            }
            catch (Exception ex)
            {

                return result.BuilderError("Error " + ex.Message);
            }
        }

        public async Task<AppResponse<List<Role>>> GetRoles()
        {
            var result = new AppResponse<List<Role>>();
            try
            {
                var list = await _roleRespository.Queryable().Where(r => r.IsDelete == false).ToListAsync();

                return result.BuilderResult(list, "Success");
            }
            catch (Exception ex)
            {

                return result.BuilderError("Error " + ex.Message);
            }
        }

        public async Task<AppResponse<Role>> UpdateRole(Role data)
        {
            var result = new AppResponse<Role>();
            try
            {
                if (data is null) return result.BuilderError("data is wrong");
                await _roleRespository.Update(data);
                return result.BuilderResult(data, "Success");
            }
            catch (Exception ex)
            {

                return result.BuilderError("Error " + ex.Message);
            }
        }

        public async Task<AppResponse<Role>> DeleteRole(Guid roleId)
        {
            var result = new AppResponse<Role>();
            try
            {
                var role = await _roleRespository.Queryable().Where(r => r.IsDelete == false).FirstOrDefaultAsync(r => r.Id == roleId);
                if (role == null)
                {
                    return result.BuilderError("Role is not existing");
                }
                await _roleRespository.Delete(role);
                return result.BuilderResult(role, "Success");
            }
            catch (Exception ex)
            {

                return result.BuilderError("Error " + ex.Message);
            }
        }

        public async Task<AppResponse<UserRole>> AssignRole(UserRoleDTO data)
        {
            var result = new AppResponse<UserRole>();
            try
            {
                if (data is null) return result.BuilderError("Data is wrong");
                UserRole userRole = _mapper.Map<UserRole>(data);
                userRole.InitialEnity();
                await _userRoleRespository.Insert(userRole);
                return result.BuilderResult(userRole, "Success");
            }
            catch (Exception ex)
            {

                return result.BuilderError("Error " + ex.Message);
            }
        }

        public async Task<AppResponse<List<UserRoleDTO>>> GetAllUserRole()
        {
            var result = new AppResponse<List<UserRoleDTO>>();
            try
            {

                var userRoles = await _userRoleRespository
                    .Queryable()
                    .Where(ur => ur.IsDelete == false)
                    .Select(ur => _mapper.Map<UserRoleDTO>(ur)).ToListAsync();
                return result.BuilderResult(userRoles, "Success");
            }
            catch (Exception ex)
            {

                return result.BuilderError("Error " + ex.Message);
            }
        }

        public async Task<AppResponse<UserRoleDTO>> DeleteUserRole(Guid userRoleId)
        {
            var result = new AppResponse<UserRoleDTO>();
            try
            {
                var userRole = await _userRoleRespository.Queryable().FirstOrDefaultAsync(ur => ur.Id == userRoleId);
                if (userRole != null)
                {
                    await _userRoleRespository.Delete(userRole);
                    return result.BuilderResult(_mapper.Map<UserRoleDTO>(userRole), "Success");
                }
                return result.BuilderError("Not found");
            }
            catch (Exception ex)
            {

                return result.BuilderError(ex.Message);
            }
        }

    }
}
