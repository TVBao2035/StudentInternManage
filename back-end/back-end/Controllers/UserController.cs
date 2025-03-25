﻿using back_end.Data;
using back_end.DTO.User;
using back_end.Enity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using System.Reflection;
using AutoMapper;
using back_end.Service.Interface;
using back_end.DTO.Auth;
using Microsoft.AspNetCore.Authorization;

namespace back_end.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var data = await _userService.GetAll();
            return Ok(data);
        }

        [HttpPost]
        [Route("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterDTO register)
        {
            var data = await _userService.Register(register);
            return Ok(data);
        }

        [HttpPost]
        [Route("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest login)
        {
            var data = await _userService.Login(login);
            return Ok(data);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UserDTO user)
        {
            var data = await _userService.Edit(user);
            return Ok(data);
        }

        // ---------- not yet -------------
        [HttpPost]
        [Route("refresh")]
        [AllowAnonymous]
        public async Task<IActionResult> Refresh([FromBody] string refresh)
        {
            return Ok();
        }
       
    }
}
