using AutoMapper;
using back_end.DTO;
using back_end.Enity;
using back_end.Enum;
using back_end.Models.Response;
using back_end.Respositories.Implement;
using back_end.Respositories.Interface;
using back_end.Service.Interface;
using Microsoft.EntityFrameworkCore;
using System.Runtime.InteropServices;

namespace back_end.Service.Implement
{
    public class AssignmentService : IAssignmentService
    {
        private IMapper _mapper;
        private IAssignmentRespository _assignmentRespository;
        private IEmployeeRespository _employeeRespository;
        private IUserService _userService;
        private ITaskRespository _taskRespository;

        public AssignmentService(
            IMapper mapper, 
            IAssignmentRespository assignmentRespository,
            IEmployeeRespository employeeRespository,
            IUserService userService,
            ITaskRespository taskRespository
            )
        {
            _mapper = mapper;
            _assignmentRespository = assignmentRespository;
            _employeeRespository = employeeRespository;
            _userService = userService;
            _taskRespository = taskRespository;
        }

        public async Task<AppResponse<AssignmentDTO>> UpdateScore(AssignmentDTO data)
        {
            var result = new AppResponse<AssignmentDTO>();
            try
            {
                var assignmentData = _mapper.Map<Assignment>(data);
                User user = await _userService.GetUserFromToken();

                var employee = await _employeeRespository
                    .FindBy(emp => !emp.IsDelete && emp.UserId == user.Id)
                    .FirstOrDefaultAsync();
                if (employee is null || employee.Type != EmployeeType.OfficalEmployee) 
                    return result.BuilderError("This account have no permisstion perform this function");
                
                var assignment = await _assignmentRespository
                    .FindBy(assign => !assign.IsDelete && assign.Id == assignmentData.Id)
                    .FirstOrDefaultAsync();
                if (assignment is null) 
                    return result.BuilderError("Not found this assignment");

                if (assignment.MentorId != employee.Id)
                    return result.BuilderError("You are not mentor of this assignment");

                assignment.Score = assignmentData.Score;
                await _assignmentRespository.Update(assignment);
                return result.BuilderResult(_mapper.Map<AssignmentDTO>(assignment),"Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError("Error" + ex.Message);
            }
        }

        public async Task<AppResponse<AssignmentDTO>> Create(AssignmentDTO data)
        {
            var result = new AppResponse<AssignmentDTO>();
            try
            {
                var mentor = await _employeeRespository.
                    FindBy(emp => !emp.IsDelete && emp.Id == data.MentorId)
                    .FirstOrDefaultAsync();
                if (mentor is null) return  result.BuilderError("Not found mentor");

                var intern = await _employeeRespository.
                    FindBy(emp => !emp.IsDelete && emp.Id == data.InternId)
                    .FirstOrDefaultAsync();
                if (intern is null) return result.BuilderError("Not found intern");

                Assignment? assignment = await _assignmentRespository
                    .FindBy(assign => !assign.IsDelete 
                        && assign.InternId == data.InternId 
                        && assign.MentorId == data.MentorId)
                    .FirstOrDefaultAsync();

                if (assignment != null) return result.BuilderError("This Assignment is exist!");
                assignment = new Assignment();
                assignment = _mapper.Map<Assignment>(data);
                assignment.InitialEnity();
                assignment.Score = 0;

                await _assignmentRespository.Insert(assignment);
                return result.BuilderResult(_mapper.Map<AssignmentDTO>(assignment),"Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError("Error: " + ex.Message);
            }
        }

        public async Task<AppResponse<bool>> Delete(Guid id)
        {
            var result = new AppResponse<bool>();
            try
            {
                var assignment = await _assignmentRespository
                    .FindBy(assign => !assign.IsDelete && assign.Id == id)
                    .FirstOrDefaultAsync();
                if (assignment is null) return result.BuilderError("Not found assignment");

                assignment.DeleteEnity();
                await _assignmentRespository.Update(assignment);
                return result.BuilderResult("Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError("Error: " + ex.Message);
            }
        }

        public async Task<AppResponse<List<AssignmentDTO>>> GetAll()
        {
            var result = new AppResponse<List<AssignmentDTO>>();
            try
            {
                var assignmentList = await _assignmentRespository
                    .FindBy(assign => !assign.IsDelete)
                    .Include(assign => assign.Intern )
                        .ThenInclude(emp => emp.User)
                    .Include(assign=>assign.Mentor)
                        .ThenInclude(emp => emp.User)
                    .Select(assign => new AssignmentDTO
                    {
                        Id = assign.Id,
                        MentorId = assign.MentorId,
                        InternId = assign.InternId,
                        Mentor = _mapper.Map<EmployeeDTO>(assign.Mentor),
                        Intern = _mapper.Map<EmployeeDTO>(assign.Intern),
                        Score = assign.Score

                    }).ToListAsync();

                return result.BuilderResult(assignmentList, "Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError("Error: " + ex.Message);
            }
        }

        public async Task<AppResponse<AssignmentDTO>> Update(AssignmentDTO data)
        {
            var result = new AppResponse<AssignmentDTO>();
            try
            {
                var assigmentData = _mapper.Map<Assignment>(data);
                Assignment? assignment = await _assignmentRespository
                    .FindBy(assign => !assign.IsDelete 
                        && assign.Id == assigmentData.Id 
                        && assign.InternId == assigmentData.InternId
                     )
                    .FirstOrDefaultAsync();
                if (assignment is null) return result.BuilderError("Not found assignment");

                Employee? mentor = await _employeeRespository
                    .FindBy(emp => !emp.IsDelete && emp.Id == assigmentData.MentorId)
                    .FirstOrDefaultAsync();
                if (mentor is null) return result.BuilderError("Not found mentor");

                if (mentor.Type != EmployeeType.OfficalEmployee)
                    return result.BuilderError("This employee is not an offical employee");


                assignment.MentorId = assigmentData.MentorId;  
                await _assignmentRespository.Update(assignment);
                return result.BuilderResult(_mapper.Map<AssignmentDTO>(assignment) ,"Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError("Error: " + ex.Message);
            }
        }

        public async Task<AppResponse<AssignmentDTO>> GetById(Guid id)
        {
            var result = new AppResponse<AssignmentDTO>();
            try
            {
                var assignment = await _assignmentRespository.FindBy(a => !a.IsDelete && a.Id == id)
                    .Include(assign => assign.Intern)
                        .ThenInclude(emp => emp.User)
                    .Include(assign => assign.Mentor)
                        .ThenInclude(emp => emp.User)
                    .Select( assign => new AssignmentDTO
                    {
                        Id = assign.Id,
                        MentorId = assign.MentorId,
                        InternId = assign.InternId,
                        Mentor = _mapper.Map<EmployeeDTO>(assign.Mentor),
                        Intern = _mapper.Map<EmployeeDTO>(assign.Intern),
                        Score = assign.Score,
                       // Tasks =  _taskRespository.FindBy(t => !t.IsDelete && t.AssignmentId == assign.Id).Select(t => _mapper.Map<TaskDTO>(t)).ToList()
                    }).FirstOrDefaultAsync();
                assignment.Tasks = await _taskRespository
                    .FindBy(t => !t.IsDelete && t.AssignmentId == assignment.Id)
                    .Select(t => _mapper.Map<TaskDTO>(t)).ToListAsync();
                if (assignment is null)
                    return result.BuilderError("Not found Assignment");
                var user = await _userService.GetUserFromToken();
                if (user.Id != assignment.InternId && user.Id != assignment.MentorId && !_userService.checkRole("manager"))
                    return result.BuilderError("You don't have permission");


                return result.BuilderResult(assignment,"Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError("Error: " + ex.Message);
            }
        }
    }
}
