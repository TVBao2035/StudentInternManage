using AutoMapper;
using back_end.Common;
using back_end.DTO;
using back_end.DTO.UserDTOModel;
using back_end.Enity;
using back_end.Enum;
using back_end.Models.Response;
using back_end.Respositories.Implement;
using back_end.Respositories.Interface;
using back_end.Service.Interface;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata.Ecma335;

namespace back_end.Service.Implement
{
    public class EmployeeService : IEmployeeService
    {
        private IEmployeeRespository _employeeRespository;

        private IMapper _mapper;
        private IUserRespository _userRespository;
        private IUserService _userService;
        private IUserRoleRespository _userRoleRespository;

        public EmployeeService(
            IEmployeeRespository employeeRespository,
            IUserRespository userRespository,
            IUserRoleRespository userRoleRespository, 
            IUserService userService,
            IMapper mapper)
        {
            _mapper = mapper;
            _employeeRespository = employeeRespository;
            _userRespository = userRespository;
            _userService = userService;
            _userRoleRespository = userRoleRespository;
        }
        public async Task<AppResponse<EmployeeDTO>> Create(EmployeeDTO employee)
        {
            var result = new AppResponse<EmployeeDTO>();
            try
            {
                var user = await _userRespository
                    .FindBy(u => u.Id == employee.UserId && !u.IsDelete).Select( u => new UserDTO
                    {
                        Id = u.Id,
                        Email = u.Email,
                        Name = u.Name,
                        BirthDate = u.BirthDate,
                        Gender = u.Gender,
                        PhoneNumber = u.PhoneNumber,
                        SchoolName = u.SchoolName,
                        Roles = u.UserRoles
                        .Where(ur=> !ur.IsDelete && ur.UserId==u.Id)
                        .Select(ur=>ur.Role)
                        .Select(r=>_mapper.Map<RoleDTO>(r))
                        .ToList()
                    })
                    .FirstOrDefaultAsync();
               
                if (user is null)  return result.BuilderError("User is not exiting");
                var newEmployee = await _employeeRespository.FindBy(e => e.UserId == employee.UserId && !e.IsDelete).FirstOrDefaultAsync();
                if (newEmployee != null) return result.BuilderError("Employee is exiting");

                newEmployee = _mapper.Map<Employee>(employee);
                newEmployee.InitialEnity();
                await _employeeRespository.Insert(newEmployee);
                employee = _mapper.Map<EmployeeDTO>(newEmployee);
                employee.User = user;
                return result.BuilderResult(employee,"Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError("Error " + ex.Message);
            }
        }

        public async Task<AppResponse<bool>> Delete(Guid employeeId)
        {
            var result = new AppResponse<bool>();
            try
            {
                var employee = await _employeeRespository.FindBy(em => !em.IsDelete && em.Id == employeeId).FirstOrDefaultAsync();
                if (employee is null) return result.BuilderError("Not found employee");
                employee.DeleteEnity();
                await _employeeRespository.Update(employee);
                return result.BuilderResult("Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError("Error " + ex.Message);
            }
        }

        public async Task<AppResponse<List<EmployeeDTO>>> GetAll()
        {
            var result = new AppResponse<List<EmployeeDTO>>();
            try
            {
                var employees = await _employeeRespository
                    .FindBy(emp => !emp.IsDelete)
                    .Select(emp => new EmployeeDTO
                    {
                        Id=emp.Id,
                        UserId = emp.UserId,
                        Type = emp.Type,
                        User = new UserDTO
                        {
                            Id=emp.UserId,
                            Name=emp.User.Name,
                            BirthDate=emp.User.BirthDate,
                            Email=emp.User.Email,
                            PhoneNumber=emp.User.PhoneNumber,
                            SchoolName=emp.User.SchoolName,
                            Gender=emp.User.Gender,
                            Roles=emp.User.UserRoles
                            .Where(ur=>!ur.IsDelete && ur.UserId==emp.UserId)
                            .Select(ur =>ur.Role)
                            .Select(r=>_mapper.Map<RoleDTO>(r))
                            .ToList()
                        }
                    })
                    .ToListAsync();
                return result.BuilderResult(employees, "Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError("Error " + ex.Message);
            }
        }

        public async Task<AppResponse<EmployeeDTO>> Update(EmployeeDTO employee)
        {
            var result = new AppResponse<EmployeeDTO>();
            try
            { 
                User userAuth = await _userService.GetUserFromToken();
                if (userAuth is null)
                    return result.BuilderError("Not found user in token");
                User user = await _userRespository.FindBy(u => u.Email.ToLower().Equals(employee.User.Email.ToLower())).FirstOrDefaultAsync();
                if (user is null)
                    return result.BuilderError("Not found user");
                bool isBusiness = _userService.checkRole("business");
                if (user.Id != userAuth.Id && !isBusiness)
                    return result.BuilderError("You don't permission perform this function");
                // if business change the employee infore, then request data will have user id and employee id
                Employee data;
                if (isBusiness && user.Id != userAuth.Id) 
                {
                    user = await _userRespository.FindBy(u => !u.IsDelete && u.Id == employee.UserId).FirstOrDefaultAsync();
                    data = await _employeeRespository.FindBy(em => !em.IsDelete && em.Id == employee.Id).FirstOrDefaultAsync();
                }
                else
                {
                    data = await _employeeRespository.FindBy(em => !em.IsDelete && em.UserId == userAuth.Id).FirstOrDefaultAsync();
                }
                if (data is null)
                    return result.BuilderError("Not found employee");
                if (user is null) 
                    return result.BuilderError("Not found account");

                data.UpdateTimeEntity();
                data.Type = employee.Type;
                await _employeeRespository.Update(data);
                user.BirthDate = Helper.FormatDate(employee.User.BirthDate);
                user.Gender = employee.User.Gender;
                user.Name = employee.User.Name;
                user.SchoolName = employee.User.SchoolName;
                await _userRespository.Update(user);

                return result.BuilderResult(employee,"Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError("Error " + ex.Message);
            }
        }
    }
}
