﻿using AutoMapper;
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

        public async Task<AppResponse<List<TaskDTO>>> GetTaskByAssignmentId(Guid id)
        {
            var result = new AppResponse<List<TaskDTO>>();
            try
            {
                return result.BuilderResult("Success");

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


                Tasks? tasks = await _taskRespository.FindBy(t => !t.IsDelete && t.Id == data.Id).FirstOrDefaultAsync();

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
                return result.BuilderResult("Success");

            }
            catch (Exception ex)
            {
                return result.BuilderError("Error: " + ex.Message);
            }
        }
    }
}
