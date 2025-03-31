using AutoMapper;
using back_end.Common.GenericRespository;
using back_end.Data;
using back_end.Enity;
using back_end.Respositories.Interface;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace back_end.Respositories.Implement
{
    public class UserRespository : BaseRespository<User>, IUserRespository
    {
        public UserRespository(ApplicationDBContext context) : base(context)
        {
        }
    }
}
