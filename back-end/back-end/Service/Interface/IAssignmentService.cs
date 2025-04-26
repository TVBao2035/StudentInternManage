using back_end.DTO;
using back_end.Models.Request;
using back_end.Models.Response;

namespace back_end.Service.Interface
{
    public interface IAssignmentService
    {
        Task<AppResponse<AssignmentDTO>> Create(AssignmentDTO data);
        Task<AppResponse<AssignmentDTO>> Update(AssignmentDTO data);
        Task<AppResponse<List<AssignmentDTO>>> GetAll();
        Task<AppResponse<bool>> Delete(Guid id);
        Task<AppResponse<AssignmentDTO>> UpdateScore(AssignmentDTO data);
        Task<AppResponse<SearchResponse<AssignmentDTO>>> Search(SearchResquest request);
    }
}
