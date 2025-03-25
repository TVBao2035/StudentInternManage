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
            services.AddScoped<IUserService, UserService>().Reverse();
            services.AddScoped<IRoleService, RoleService>().Reverse();
            services.AddScoped<IUserRespository, UserRespository>().Reverse();
            services.AddScoped<IRoleRespository, RoleRespository>().Reverse();
            services.AddScoped<ITokenRespository, TokenRespository>().Reverse();
            services.AddScoped<IUserRoleRespository, UserRoleRespository>().Reverse();
            services.AddScoped<ITechnologyRespository, TechnologyRespository>().Reverse();


            services.AddScoped<IPasswordHasher, PasswordHasher>().Reverse();
        }
    }
}
