using back_end.DTO;
using back_end.Models.Request;
using back_end.Models.Response;

namespace back_end.Service.Interface
{
    public interface IPostService
    {
        Task<AppResponse<List<PostDTO>>> GetAll();
        Task<AppResponse<PostDTO>> Create(PostDTO post);
        Task<AppResponse<PostDTO>> Update(PostDTO post);
        Task<AppResponse<bool>> Delete(Guid postId);
        Task<AppResponse<PostDTO>> GetById(Guid id);
       
        Task<AppResponse<SearchResponse<PostDTO>>> Search(SearchRequest request);
    }
}
