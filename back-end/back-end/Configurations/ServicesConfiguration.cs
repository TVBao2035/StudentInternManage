using back_end.Common.PasswordHasher;
using back_end.Respositories.Implement;
using back_end.Respositories.Interface;
using back_end.Service.Implement;
using back_end.Service.Interface;

namespace back_end.Configurations
{
    public static class ServicesConfiguration
    {
        public static void AddServices(this IServiceCollection services)
        {
            //------------ Service ----------------//
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<ITechnologyService, TechnologyService>();
            services.AddScoped<IPostService, PostService>();
            services.AddScoped<IEmployeeService, EmployeeService>();
            services.AddScoped<IJobService, JobService>();
            services.AddScoped<IAssignmentService, AssignmentService>();
            services.AddScoped<ITaskService, TaskService>();

            //------------ Respository ------------//
            services.AddScoped<IUserRespository, UserRespository>();
            services.AddScoped<IRoleRespository, RoleRespository>();
            services.AddScoped<ITokenRespository, TokenRespository>();
            services.AddScoped<IUserRoleRespository, UserRoleRespository>();
            services.AddScoped<ITechnologyRespository, TechnologyRespository>();
            services.AddScoped<IPostRespository, PostRespository>();
            services.AddScoped<IPostTechnologyRespository, PostTechnologyRespository>();
            services.AddScoped<IEmployeeRespository, EmployeeRespository>();
            services.AddScoped<IJobRespository, JobRespository>();
            services.AddScoped<IAssignmentRespository, AssignmentRespository>();
            services.AddScoped<ITaskRespository, TaskRespository>();

            // ---------------- Other _____________ //
            services.AddScoped<IPasswordHasher, PasswordHasher>();
        }
    }
}
