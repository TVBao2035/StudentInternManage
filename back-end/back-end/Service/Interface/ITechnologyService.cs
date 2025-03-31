using back_end.DTO;
using back_end.Models.Response;

namespace back_end.Service.Interface
{
    public interface ITechnologyService
    {
        Task<AppResponse<TechnologyDTO>> Create(TechnologyDTO technology);
        Task<AppResponse<TechnologyDTO>> Update(TechnologyDTO technology);
        Task<AppResponse<bool>> Delete(Guid technologyId);
        Task<AppResponse<List<TechnologyDTO>>> GetAll();

    }
}
