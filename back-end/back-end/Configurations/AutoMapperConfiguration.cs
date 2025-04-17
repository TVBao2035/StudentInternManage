using AutoMapper;
using back_end.DTO;
using back_end.DTO.Auth;
using back_end.DTO.UserDTOModel;
using back_end.Enity;

namespace back_end.Configurations
{
    public class AutoMapperConfiguration : Profile
    {
        public AutoMapperConfiguration()
        {
            CreateMap<User, RegisterDTO>().ReverseMap();
            CreateMap<User, UserDTO>().ReverseMap();
            CreateMap<UserRole, UserRoleDTO>().ReverseMap();
            CreateMap<Role, RoleDTO>().ReverseMap();
            CreateMap<Technology, TechnologyDTO>().ReverseMap();
            CreateMap<Post, PostDTO>().ReverseMap();
            CreateMap<Employee, EmployeeDTO>().ReverseMap();
            CreateMap<Job, JobDTO>().ReverseMap();
            CreateMap<Assignment, AssignmentDTO>().ReverseMap();
            CreateMap<Tasks, TaskDTO>().ReverseMap();
        }

    }
}
