using back_end.Common.GenericRespository;
using back_end.Data;
using back_end.Respositories.Interface;

namespace back_end.Respositories.Implement
{
    public class PostTechnologyRespository : BaseRespository<PostRespository>, IPostTechnologyRespository
    {
        public PostTechnologyRespository(ApplicationDBContext context) : base(context)
        {
        }
    }
}
