using back_end.DTO;
using back_end.Models.Request;
using back_end.Models.Response;

namespace back_end.Service.Interface
{
    public interface ITaskService
    {
        Task<AppResponse<SearchResponse<TaskDTO>>> Search(SearchResquest resquest);
        Task<AppResponse<List<TaskDTO>>> GetAll();
        Task<AppResponse<List<TaskDTO>>> GetTaskByAssignmentId(Guid assignmentId);
        Task<AppResponse<TaskDTO>> Create(TaskDTO data);
        Task<AppResponse<TaskDTO>> Update(TaskDTO data);
        Task<AppResponse<TaskDTO>> UpdateStatus(TaskDTO data);
        Task<AppResponse<bool>> Delete(Guid id);
    }
}
