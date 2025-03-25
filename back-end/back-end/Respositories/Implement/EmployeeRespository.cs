using back_end.Common.GenericRespository;
using back_end.Data;
using back_end.Enity;
using back_end.Respositories.Interface;

namespace back_end.Respositories.Implement
{
    public class EmployeeRespository : BaseRespository<Employee>, IEmployeeRespository
    {
        public EmployeeRespository(ApplicationDBContext context) : base(context)
        {
        }
    }
}
