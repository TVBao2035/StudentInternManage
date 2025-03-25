using AutoMapper;
using back_end.DTO.Auth;
using back_end.DTO.User;
using back_end.Enity;

namespace back_end.Configurations
{
    public class AutoMapperConfiguration:Profile
    {
        public AutoMapperConfiguration()
        {

            CreateMap<User, RegisterDTO>().ReverseMap();
            CreateMap<User, UserDTO>().ReverseMap();
            CreateMap<UserRole, UserRoleDTO>().ReverseMap();
            CreateMap<Role, RoleDTO>().ReverseMap();
        }
       
    }
}
