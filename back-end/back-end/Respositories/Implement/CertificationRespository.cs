using back_end.Common.GenericRespository;
using back_end.Data;
using back_end.Enity;
using back_end.Respositories.Interface;

namespace back_end.Respositories.Implement
{
    public class CertificationRespository : BaseRespository<Certifications>, ICertificationRespository
    {
        public CertificationRespository(ApplicationDBContext context) : base(context)
        {
        }
    }
}
