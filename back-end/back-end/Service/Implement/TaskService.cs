using AutoMapper;
using back_end.DTO;
using back_end.Enity;
using back_end.Models.Response;
using back_end.Respositories.Implement;
using back_end.Enum;
using back_end.Respositories.Interface;
using back_end.Service.Interface;
using Microsoft.EntityFrameworkCore;

namespace back_end.Service.Implement
{
    public class TaskService : ITaskService
    {
        private ITaskRespository _taskRespository;
        private IMapper _mapper;
        private IUserService _userService;
        private IAssignmentRespository _assignmentRespository;
        private IEmployeeRespository _employeeRespository;

        public TaskService(
            ITaskRespository taskRespository,
            IMapper mapper,
            IAssignmentRespository assignmentRespository,
            IUserService userService,
            IEmployeeRespository employeeRespository
            )
        {
            _taskRespository = taskRespository;
            _mapper = mapper;
            _userService = userService;
            _assignmentRespository = assignmentRespository;
            _employeeRespository = employeeRespository;
        }
        public async Task<AppResponse<List<TaskDTO>>> GetByInternId()
        {
            var result = new AppResponse<List<TaskDTO>> ();
            try
            {

                var user = await _userService.GetUserFromToken();
                var employee = await _employeeRespository.FindBy(e => !e.IsDelete && e.UserId == user.Id).FirstOrDefaultAsync();
                if (employee is null)
                    return result.BuilderError("you are not employee");
                if (employee.Type != EmployeeType.Intern)
                    return result.BuilderError("You are not intern");

                var task = await _taskRespository
                    .FindBy(t => !t.IsDelete)
                    .Include(t => t.Assignment)
                    .Where(t => t.Assignment.InternId == employee.Id).ToListAsync();
            

                if (task is null)
                    return result.BuilderError("Not found Task");
                var tasks = task.Select(t => new TaskDTO
                {
                    Id = t.Id,
                    AssignmentId = t.AssignmentId,
                    Name = t.Name,
                    Note = t.Note,
                    Status = t.Status
                }).ToList();
                //if ( task.Assignment.InternId != employee.Id)
                //    return result.BuilderError("You don't have permission");
                //task.Assignment = null;
                //var taskDTO = _mapper.Map<TaskDTO>(task);
                return result.BuilderResult(tasks, "Success");

            }
            catch (Exception ex)
            {
                return result.BuilderError("Error: " + ex.Message);
            }
        }
        public async Task<AppResponse<TaskDTO>> GetById(Guid id)
        {
            var result = new AppResponse<TaskDTO>();
            try
            {
                var user = await _userService.GetUserFromToken();
                var task = await _taskRespository
                    .FindBy(t => !t.IsDelete && t.Id == id)
                    .Include(t => t.Assignment)
                    .FirstOrDefaultAsync();
                if (task is null)
                    return result.BuilderError("Not found Task");
                if (!_userService.checkRole("manager") && task.Assignment.InternId != user.Id && task.Assignment.MentorId != user.Id)
                    return result.BuilderError("You don't have permission");
                task.Assignment = null;
                var taskDTO = _mapper.Map<TaskDTO>(task);
                return result.BuilderResult(taskDTO, "Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError("Error: " + ex.Message);
            }
        }
        public async Task<AppResponse<TaskDTO>> Create(TaskDTO data)
        {
            var result = new AppResponse<TaskDTO>();
            try
            {
                User user = await _userService.GetUserFromToken();
                Employee? mentor = await _employeeRespository
                    .FindBy(emp => !emp.IsDelete && emp.UserId == user.Id)
                    .FirstOrDefaultAsync();

                if (mentor is null) return result.BuilderError("You are not employee");

                Assignment? assignment = await _assignmentRespository
                    .FindBy(assign => !assign.IsDelete && assign.Id == data.AssignmentId)
                    .FirstOrDefaultAsync();

                if (assignment is null) return result.BuilderError("Not found assignment");

                if (mentor.Id != assignment.MentorId) 
                    return result.BuilderError("You are not mentor of this assignment, so you can't create task for it");

                Tasks newTask = _mapper.Map<Tasks>(data);
                newTask.InitialEnity();
                newTask.Status = TasksStatus.Pending;
                
                // call api here
                await _taskRespository.Insert(newTask);

                // avoid sending too much data
                newTask.Assignment = null;
                return result.BuilderResult(_mapper.Map<TaskDTO>(newTask),"Success");
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
                var tasks = await _taskRespository
                    .FindBy(t => !t.IsDelete && t.Id == id).Include(t =>t.Assignment)
                    .FirstOrDefaultAsync();

                if (tasks is null) 
                    return result.BuilderError("Not found this task");

                User user = await _userService.GetUserFromToken();

                var metor = await _employeeRespository
                    .FindBy(emp => !emp.IsDelete && emp.UserId == user.Id)
                    .FirstOrDefaultAsync();

                if (metor is null) 
                    return result.BuilderError("This account is not Employee");

                if (metor.Id != tasks.Assignment.MentorId)
                    return result.BuilderError("Employee is not mentor of this assign");

                tasks.DeleteEnity();

                await _taskRespository.Update(tasks);
                return result.BuilderResult("Success");

            }
            catch (Exception ex)
            {
                return result.BuilderError("Error: " + ex.Message);
            }
        }

        public async Task<AppResponse<List<TaskDTO>>> GetAll()
        {
            var result = new AppResponse<List<TaskDTO>>();
            try
            {
                var taskList = await _taskRespository
                    .FindBy(t => !t.IsDelete)
                    .Include(t => t.Assignment).ThenInclude(assign => assign.Intern).ThenInclude(emp => emp.User)
                    .Include(t => t.Assignment).ThenInclude(assign => assign.Mentor).ThenInclude(emp => emp.User)
                    .Select(t => new TaskDTO
                    {
                        Id = t.Id,
                        Name = t.Name,
                        Note = t.Note,
                        AssignmentId = t.AssignmentId,
                        Status = t.Status,
                        Assignment = _mapper.Map<AssignmentDTO>(t.Assignment)
                    })
                    .ToListAsync();
                return result.BuilderResult(taskList,"Success");

            }
            catch (Exception ex)
            {
                return result.BuilderError("Error: " + ex.Message);
            }
        }

        public async Task<AppResponse<List<TaskDTO>>> GetTaskByAssignmentId(Guid assignmentId)
        {
            var result = new AppResponse<List<TaskDTO>>();
            try
            {
                User user = await _userService.GetUserFromToken();

                var employee = await _employeeRespository
                    .FindBy(emp => !emp.IsDelete && emp.UserId == user.Id)
                    .FirstOrDefaultAsync();

                if (employee is null) return result.BuilderError("Not found employee");

                var assignment = await _assignmentRespository
                    .FindBy(assign => !assign.IsDelete && assign.Id == assignmentId)
                    .FirstOrDefaultAsync();

                if (assignment is null) return result.BuilderError("Not found assignment");

                if (assignment.InternId != employee.Id && assignment.MentorId != employee.Id)
                    return result.BuilderError("You are not in this assignment");

                var tasksList = await _taskRespository
                    .FindBy(t => !t.IsDelete && t.AssignmentId == assignmentId)
                    .Select(t => new TaskDTO
                    {
                        Id = t.Id,
                        AssignmentId = t.AssignmentId,
                        Name = t.Name,
                        Note = t.Note,
                        Status = t.Status
                    })
                    .ToListAsync();

                return result.BuilderResult(tasksList, "Success");

            }
            catch (Exception ex)
            {
                return result.BuilderError("Error: " + ex.Message);
            }
        }

        public async Task<AppResponse<TaskDTO>> Update(TaskDTO data)
        {
            var result = new AppResponse<TaskDTO>();
            try
            {
                User user = await _userService.GetUserFromToken();

                Employee? mentor = await _employeeRespository
                    .FindBy(emp => !emp.IsDelete && emp.UserId == user.Id)
                    .FirstOrDefaultAsync();

                if (mentor is null) 
                    return result.BuilderError("You are not employee");


                Tasks? tasks = await _taskRespository
                    .FindBy(t => !t.IsDelete && t.Id == data.Id)
                    .FirstOrDefaultAsync();

                if(tasks is null) 
                    return result.BuilderError("Not found task");

                Assignment? assignment = await _assignmentRespository
                    .FindBy(assign => !assign.IsDelete && assign.Id == data.AssignmentId)
                    .FirstOrDefaultAsync();

                if (assignment is null) 
                    return result.BuilderError("Not found assignment");

                if(tasks.AssignmentId != assignment.Id) 
                    return result.BuilderError("Tasks don't match Assignment");


                if (mentor.Id != assignment.MentorId)
                    return result.BuilderError("You are not mentor of this assignment, so you can't create task for it");


                tasks.Name = data.Name;
                tasks.Note = data.Note;
                tasks.UpdateTimeEntity();
                await _taskRespository.Update(tasks);
                tasks.Assignment = null;
                return result.BuilderResult( _mapper.Map<TaskDTO>(tasks),"Success");

            }
            catch (Exception ex)
            {
                return result.BuilderError("Error: " + ex.Message);
            }
        }

        public async Task<AppResponse<TaskDTO>> UpdateStatus(TaskDTO data)
        {
            var result = new AppResponse<TaskDTO>();
            try
            {
                User user = await _userService.GetUserFromToken();

                var employee = await _employeeRespository
                    .FindBy(emp => !emp.IsDelete && emp.UserId == user.Id)
                    .FirstOrDefaultAsync();

                if (employee is null) return result.BuilderError("Not found employee");

                var assignment = await _assignmentRespository
                    .FindBy(assign => !assign.IsDelete && assign.Id == data.AssignmentId)
                    .FirstOrDefaultAsync();

                if (assignment is null) return result.BuilderError("Not found assignment");

                if (assignment.MentorId != employee.Id)
                    return result.BuilderError("You are not mentor of this assignment");

                Tasks? tasks = await _taskRespository
                    .FindBy(t => !t.IsDelete && t.Id == data.Id)
                    .FirstOrDefaultAsync();

                if (tasks is null)
                    return result.BuilderError("Not found task");

                if (tasks.AssignmentId != assignment.Id)
                    return result.BuilderError("Tasks don't match Assignment");


                tasks.Status = _mapper.Map<Tasks>(data).Status;
                tasks.UpdateTimeEntity();
                await _taskRespository.Update(tasks);
                tasks.Assignment = null;
                return result.BuilderResult(_mapper.Map<TaskDTO>(tasks),"Success");

            }
            catch (Exception ex)
            {
                return result.BuilderError("Error: " + ex.Message);
            }
        }
    }
}
