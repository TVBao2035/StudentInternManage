using back_end.Service.Interface;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace back_end.Configurations
{
    public static class AuthenticationConfiguration
    {
        public static void AddAuthencicationConfiguration(this WebApplicationBuilder builder)
        {
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultForbidScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidIssuer = builder.Configuration["Authentication:Issuer"],
                    ValidateAudience = false,
                    ValidAudience = builder.Configuration["Authentication:Audience"],
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Authentication:Key"]))

                };
                options.Events = new JwtBearerEvents()
                {
                   OnTokenValidated = (context) =>
                   {
                       var validateToken = context.HttpContext.RequestServices.GetRequiredService<IUserService>();
                       return validateToken.ValidateTAccessToken(context);
                   },
                   OnAuthenticationFailed = (context) =>
                   {
                       return Task.CompletedTask;
                   },
                   OnChallenge = (context) =>
                   {
                       return Task.CompletedTask;
                   },
                   OnForbidden = (context) =>
                   {
                       return Task.CompletedTask;
                   },
                   OnMessageReceived = (context) =>
                   {
                       return Task.CompletedTask;
                   }

                };
            });
         
        }
    }
}
