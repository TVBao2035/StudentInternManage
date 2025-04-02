using back_end.Common.GenericRespository;
using back_end.Data;
using back_end.Enity;
using back_end.Respositories.Interface;

namespace back_end.Respositories.Implement
{
    public class AssignmentRespository : BaseRespository<Assignment>, IAssignmentRespository
    {
        public AssignmentRespository(ApplicationDBContext context) : base(context)
        {
        }
    }
}
