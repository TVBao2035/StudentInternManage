using AutoMapper;
using Azure.Core;
using back_end.Common;
using back_end.DTO;
using back_end.DTO.UserDTOModel;
using back_end.Enity;
using back_end.Enum;
using back_end.Models.Request;
using back_end.Models.Response;
using back_end.Respositories.Implement;
using back_end.Respositories.Interface;
using back_end.Service.Interface;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection.Metadata.Ecma335;

namespace back_end.Service.Implement
{
    public class EmployeeService : IEmployeeService
    {
        private IEmployeeRespository _employeeRespository;
        private IAssignmentRespository _assignmentRespository;
        private IMapper _mapper;
        private IUserRespository _userRespository;
        private IUserService _userService;
        private IUserRoleRespository _userRoleRespository;

        public EmployeeService(
            IEmployeeRespository employeeRespository,
            IUserRespository userRespository,
            IUserRoleRespository userRoleRespository, 
            IUserService userService,
            IAssignmentRespository assignmentRespository,
            IMapper mapper)
        {
            _mapper = mapper;
            _employeeRespository = employeeRespository;
            _assignmentRespository = assignmentRespository;
            _userRespository = userRespository;
            _userService = userService;
            _userRoleRespository = userRoleRespository;
        }
        public async Task<AppResponse<SearchResponse<EmployeeDTO>>> Search(SearchRequest request)
        {
            var response = new AppResponse<SearchResponse<EmployeeDTO>>();
            try
            {
                IQueryable<Employee> queryable = QueryableBuilder(request.Filters);
                var employee = queryable
                    .Include(emp => emp.User)
                    .ToList();

                if(request.SortOrder is not null)
                {
                    if (request.SortOrder.IsASC)
                    {
                        employee = employee.OrderBy(em => em.GetType().GetProperty(request.SortOrder.FieldName)?.GetValue(em, null)).ToList();
                    }else
                        employee = employee.OrderBy(em => em.GetType().GetProperty(request.SortOrder.FieldName)?.GetValue(em, null)).ToList();
                }
                int currPage = request.CurrPage - 1;
                int pageSize = request.PageSize;
                int totalPage = employee.Count / pageSize;
                if (employee.Count % pageSize != 0) totalPage++;


                var searchResponse = new SearchResponse<EmployeeDTO>
                {
                    CurrPage = currPage + 1,
                    TotalPage = totalPage,
                    SearchResults = employee
                        .Skip(pageSize * currPage)
                        .Take(pageSize)
                        .Select(em => _mapper.Map<EmployeeDTO>(em))
                        .ToList()
                };


                return response.BuilderResult(searchResponse,"Success");
            }
            catch (Exception ex)
            {
                return response.BuilderError("Error : " + ex.Message);
            }
        }

        public IQueryable<Employee> QueryableBuilder(List<SearchFilter> filters)
        {
            IQueryable<Employee> query = _employeeRespository.Queryable();
            query = query.Where(p => !p.IsDelete);
            if (filters is not null)
            {
                foreach (var filter in filters)
                {
                    string fieldName = filter.FieldName.Trim().ToLower();
                    string value = filter.Value.Trim().ToLower();
                    switch (fieldName)
                    {
                        case "name":
                            query = query
                                .Where(emp => emp.User.Name.Contains(filter.Value));
                            break;
                        case "email":
                            query = query
                               .Where(emp => emp.User.Email.Equals(filter.Value));
                            break;
                        case "phonenumber":
                            query = query
                               .Where(emp => emp.User.PhoneNumber.Equals(filter.Value));
                            break;
                        case "type":
                            query = query
                               .Where(emp => emp.Type == EmployeeType.Intern);
                            break;
                        default:
                            break;
                    }
                }
            }
            return query;
        }


        public async Task<AppResponse<List<EmployeeDTO>>> GetInterns()
        {
            var result = new AppResponse<List<EmployeeDTO>>();
            try
            {
                var internsList = await _employeeRespository
                    .FindBy(emp => !emp.IsDelete && emp.Type == EmployeeType.Intern)
                    .Include(emp => emp.User)
                    .Select(emp => _mapper.Map<EmployeeDTO>(emp))
                    .ToListAsync();

                return result.BuilderResult(internsList,"Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError("Error " + ex.Message);
            }
        }

        public async Task<AppResponse<List<EmployeeDTO>>> GetInternsNotAssigned()
        {
            var result = new AppResponse<List<EmployeeDTO>>();
            try
            {
                var internsList = await _employeeRespository
                    .FindBy(emp => !emp.IsDelete && emp.Type == EmployeeType.Intern)
                    .Include(emp => emp.User)
                    .ToListAsync();
                List<EmployeeDTO> internNotAssigned = new List<EmployeeDTO>();
                Assignment isAssigned;
                foreach (var intern in internsList)
                {
                    isAssigned = await _assignmentRespository
                        .FindBy(ass => !ass.IsDelete && ass.InternId == intern.Id)
                        .FirstOrDefaultAsync();

                    if (isAssigned is null) internNotAssigned.Add(_mapper.Map<EmployeeDTO>(intern));

                }
                return result.BuilderResult(internNotAssigned, "Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError("Error " + ex.Message);
            }
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

        public async Task<AppResponse<EmployeeDTO>> GetById(Guid id)
        {
            var result = new AppResponse<EmployeeDTO>();
            try
            {
                var employee = await _employeeRespository
                    .FindBy(e => !e.IsDelete && e.Id == id)
                    .Include(e => e.User)
                    .FirstOrDefaultAsync();
                if (employee is null)
                    return result.BuilderError("Not found employee");
                var user = await _userService.GetUserFromToken();
                if (user.Id != employee.UserId && !_userService.checkRole("manager"))
                    return result.BuilderError("You don't have permission");

                
                return result.BuilderResult(_mapper.Map<EmployeeDTO>(employee), "Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError("Error" + ex.Message);
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
                if (user.Email.ToLower() != employee.User.Email.ToLower() || user.PhoneNumber != employee.User.PhoneNumber)
                {
                    return result.BuilderError("Email or PhoneNumber cannot be changed");
                }
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
