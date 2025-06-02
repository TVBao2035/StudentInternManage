using back_end.DTO;
using back_end.Models.Response;

namespace back_end.Service.Interface
{
    public interface IJobService
    {
        Task<AppResponse<JobDTO>> Create(JobDTO data);
        Task<AppResponse<List<JobDTO>>> GetAll();
        Task<AppResponse<bool>> Delete(Guid id);
        Task<AppResponse<JobDTO>> Update(JobDTO data);
        Task<AppResponse<JobDTO>> GetById(Guid id);
        Task<AppResponse<List<JobDTO>>> GetMyApplications();

    }
}
