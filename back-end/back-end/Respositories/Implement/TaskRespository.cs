using back_end.Common.GenericRespository;
using back_end.Data;
using back_end.Enity;
using back_end.Respositories.Interface;

namespace back_end.Respositories.Implement
{
    public class TaskRespository : BaseRespository<Tasks>, ITaskRespository
    {
        public TaskRespository(ApplicationDBContext context) : base(context)
        {
        }
    }
}
