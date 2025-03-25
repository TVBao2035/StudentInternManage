﻿using back_end.DTO.Auth;
using back_end.DTO.User;
using back_end.Enity;
using back_end.Models.Response;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace back_end.Service.Interface
{
    public interface IUserService
    {
        Task<AppResponse<LoginResponse>> Login(LoginRequest data);
        Task<AppResponse<UserDTO>> Register(RegisterDTO data);
        Task<AppResponse<List<UserDTO>>> GetAll();
        Task<AppResponse<UserDTO>> Edit(UserDTO data);
        Task<AppResponse<UserDTO>> Create(UserDTO data);
        Task<AppResponse<UserDTO>> Delete(Guid userId);
        Task ValidateTAccessToken(TokenValidatedContext context);



    }
}
