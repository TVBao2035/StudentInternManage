using back_end.DTO;
using back_end.Models.Request;
using back_end.Models.Response;

namespace back_end.Service.Interface
{
    public interface IEmployeeService
    {
        Task<AppResponse<SearchResponse<EmployeeDTO>>> Search(SearchResquest request);
        Task<AppResponse<List<EmployeeDTO>>> GetAll();
        Task<AppResponse<EmployeeDTO>> Create(EmployeeDTO employee);
        Task<AppResponse<EmployeeDTO>> Update(EmployeeDTO employee);
        Task<AppResponse<bool>> Delete(Guid employeeId);
        //Task<AppResponse<EmployeeDTO>> GetById(Guid id);
    }
}
