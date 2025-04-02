using back_end.Data;
using back_end.Respositories.Implement;
using back_end.Respositories.Interface;
using back_end.Service.Implement;
using back_end.Service.Interface;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace back_end.Configurations
{
    public static class Configuration
    {
        public static void AddConfiguration(this WebApplicationBuilder builder)
        {
            builder.Services.AddServices();
            builder.AddAuthencicationConfiguration();
            builder.Services.AddAutoMapper(typeof(AutoMapperConfiguration));
            builder.Services.AddDbContext<ApplicationDBContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("Server"));
            });
          
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.SetIsOriginAllowed(origin => true)
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
                });
            });
           
        }
       
    }
}
