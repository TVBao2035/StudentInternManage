using AutoMapper;
using back_end.Common.PasswordHasher;
using back_end.DTO.Auth;
using back_end.DTO.User;
using back_end.Enity;
using back_end.Enum;
using back_end.Models.Response;
using back_end.Respositories.Implement;
using back_end.Respositories.Interface;
using back_end.Service.Interface;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace back_end.Service.Implement
{
    public class UserService : IUserService
    {
        private IUserRespository _userRespository;
        private IMapper _mapper;
        private IPasswordHasher _passwordHasher;
        private IRoleRespository _roleRespository;
        private IUserRoleRespository _userRoleRespository;
        private ITokenRespository _tokenResposirory;
        private IConfiguration _config;


        public UserService(IUserRespository userRespository, 
            IConfiguration config,
            IMapper mapper, 
            IPasswordHasher passwordHasher, 
            ITokenRespository tokenRespository,
            IRoleRespository roleRespository,
            IUserRoleRespository userRoleRespository
            )
        {
            _userRespository = userRespository;
            _mapper = mapper;
            _passwordHasher = passwordHasher;
            _roleRespository = roleRespository;
            _userRoleRespository = userRoleRespository;
            _tokenResposirory = tokenRespository;
            _config = config;
        }

        public async Task<AppResponse<LoginResponse>> Login(LoginRequest data)
        {
            var result = new AppResponse<LoginResponse>();
            try
            {
                var user = await _userRespository.Queryable().FirstOrDefaultAsync(u => u.Email == data.Email);

                if (user == null) return result.BuilderError("Login is not success");
     
                if (!_passwordHasher.Verity(user.Password, data.Password))
                {
                    return result.BuilderResult("Password is wrong");
                }
                
                (string accessToken, DateTime accessTokenExpired) = await CreateAccessToken(user);
                (string refreshToken, DateTime refreshTokenExpired, string code) = await CreateRefreshToken(user);

                Token token = new Token();
                token.Id = Guid.NewGuid();
                token.Code = code;
                token.IsDelete = false;
                token.CreatedAt = DateTime.UtcNow;
                token.RefreshToken = refreshToken;
                token.UpdateAt = DateTime.UtcNow;
                token.UserId = user.Id;
                
                await _tokenResposirory.Insert(token);

                var loginResponse = new LoginResponse();
                loginResponse.RefreshToken = refreshToken;
                loginResponse.AccessToken = accessToken;
                loginResponse.Name = user.Name;
                loginResponse.Email = user.Email;
                loginResponse.Roles = await _userRoleRespository
                    .Queryable()
                    .Where(ur => ur.UserId == user.Id)
                    .Select(ur => ur.Role.Name)
                    .ToListAsync();

                return result.BuilderResult(loginResponse, "Success");
            }
            catch (Exception e)
            {

                return result.BuilderError("Error: " + e.Message);
            }
        }

        public async Task<AppResponse<UserDTO>> Register(RegisterDTO data)
        {
            var result = new AppResponse<UserDTO>();
            try
            {
                User? newUser = await _userRespository.Queryable()
                    .Where(user => !user.IsDelete)
                    .FirstOrDefaultAsync(user => user.Email.Equals(data.Email) || user.PhoneNumber.Equals(data.PhoneNumber));

                if (newUser != null) return result.BuilderError("Account has register already");

                newUser = _mapper.Map<User>(data);
                newUser.Id = Guid.NewGuid();
                newUser.IsDelete = false;
                newUser.UpdateAt = DateTime.UtcNow;
                newUser.CreatedAt = DateTime.UtcNow;
                newUser.Password = _passwordHasher.Hash(newUser.Password);

                Role role = await _roleRespository.Queryable().FirstAsync(r => r.Name.Equals("student"));
                if (role is null) 
                    return result.BuilderError("Error");

                UserRole userRole = new UserRole();
                userRole.Id = Guid.NewGuid();
                userRole.CreatedAt = DateTime.UtcNow;
                userRole.UpdateAt = DateTime.UtcNow;
                userRole.IsDelete = false;

                await _userRespository.Insert(newUser);
                userRole.UserId = newUser.Id;
                userRole.RoleId = role.Id;
              
                await _userRoleRespository.Insert(userRole);
                return result.BuilderResult(_mapper.Map<UserDTO>(newUser), "Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError("Error" + ex);
            }
        }

        public async Task<AppResponse<List<UserDTO>>> GetAll()
        {
            var result = new AppResponse<List<UserDTO>>();
            try
            {
                var listUser = await _userRespository.Queryable()
                    .Where(user => user.IsDelete == false)
                    .Select(user => _mapper.Map<UserDTO>(user))
                    .ToListAsync();
                
                foreach(var user in listUser)
                {
                    var userRoleList = await _userRoleRespository.Queryable().Where(ur => ur.UserId == user.Id).ToListAsync();
                    if(userRoleList.Count != 0)
                    {
                        user.Roles = new List<RoleDTO>();
                        foreach(var userRole in userRoleList)
                        {
                            var role = _mapper.Map<RoleDTO>(await _roleRespository.Queryable().FirstOrDefaultAsync(r => r.Id == userRole.RoleId));
                            user.Roles.Add(role);
                        }
                    }
                }
                return result.BuilderResult(listUser, "success");
            }
            catch (Exception ex)
            {

                return result.BuilderError("Error " + ex);
            }
        }

        public async Task<AppResponse<UserDTO>> Edit(UserDTO data)
        {
            var result = new AppResponse<UserDTO>();
            try
            {
                User user = await _userRespository.Queryable()
                    .Where(u => u.Id == data.Id)
                    .FirstOrDefaultAsync();
                if(user is null) return result.BuilderError("User id is invalid");
                

                User newUser = _mapper.Map<User>(data);
                newUser.IsDelete = false;
                newUser.CreatedAt = user.CreatedAt;
                newUser.UpdateAt = DateTime.UtcNow;

                List<Guid> roles = await _userRoleRespository
                    .Queryable()
                    .Where(ur => ur.UserId == user.Id)
                    .Select(ur => ur.RoleId).ToListAsync();
                bool isCheck = false;
                foreach(var role in roles)
                {
                    isCheck = data.Roles.Select(r => r.Id).ToList().Contains(role);
                    if (!isCheck)
                    {
                        // delete user - role
                    }
                }
              /*  foreach(var role in data.Roles)
                {
                    if (role.Id != null && userRoles.Contains(role.Id))
                    {

                    }
                }*/


                return result.BuilderResult(_mapper.Map<UserDTO>(newUser), "Success");
                
            }
            catch (Exception ex)
            {

                return result.BuilderError(ex.Message);
            }
        }

        public Task<AppResponse<UserDTO>> Create(UserDTO data)
        {
            throw new NotImplementedException();
        }

        public Task<AppResponse<UserDTO>> Delete(Guid userId)
        {
            throw new NotImplementedException();
        }

        public async Task<AppResponse<LoginResponse>> Refresh(string refresh)
        {
            var result = new AppResponse<LoginResponse>();
            try
            {
                return result.BuilderResult("OK");
            }
            catch (Exception ex)
            {
                return result.BuilderError(ex.Message);
            }
        }

        private async Task<List<Claim>> GetClaims(User user)
        {
            var claims = new List<Claim>
            {
                new Claim("Name", user.Name),
                new Claim("Email", user.Email),
                new Claim("Phone", user.PhoneNumber)
            };

            var roles = await _userRoleRespository
                .Queryable()
                .Where(ur => ur.UserId == user.Id)
                .Select(ur => ur.Role)
                .ToListAsync();
            foreach(var role in roles)
            {
                claims.Add(new Claim("Roles", role.Name));
                claims.Add(new Claim(ClaimTypes.Role, role.Name));
            }

            return claims;
        }
       
        private async Task<(string, DateTime)> CreateAccessToken(User user)
        {
            DateTime expired = DateTime.UtcNow.AddMinutes(5);
            var claims = await GetClaims(user);
            claims.Add(new Claim(JwtRegisteredClaimNames.Exp, expired.ToString()));
            var accessToken = GenerationToken(claims, expired);
            return (accessToken, expired);
        }

        private async Task<(string, DateTime, string)> CreateRefreshToken(User user)
        {
            DateTime expired = DateTime.UtcNow.AddHours(1);
            string code = Guid.NewGuid().ToString();
            var claims = await GetClaims(user);
            claims.Add(new Claim(JwtRegisteredClaimNames.Exp, expired.ToString()));
            claims.Add(new Claim(ClaimTypes.SerialNumber, code));
            var refreshToken = GenerationToken(claims, expired);
            return (refreshToken, expired, code);
        }

        private string GenerationToken(List<Claim> claims, DateTime dateTime)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Authentication:Key"]));
            var credential = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var tokenInfor = new JwtSecurityToken(
                   issuer: _config["Authentication:Issuer"],
                   audience: _config["Authentication:Audience"],
                   claims,
                   expires: dateTime,
                   signingCredentials: credential
                );
            return new JwtSecurityTokenHandler().WriteToken(tokenInfor);
        }

        public async Task<User> ValidateRefreshToken(string refreshToken)
        {
            try
            {
                var claimPrincial = new JwtSecurityTokenHandler().ValidateToken(
                refreshToken,
                new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidIssuer = _config["Authentication:Issuer"],
                    ValidateAudience = false,
                    ValidAudience = _config["Authentication:Audience"],
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Authentication:Key"])),
                    RequireExpirationTime = true,
                    ClockSkew = TimeSpan.Zero
                },
                out _
                );
                var claims = claimPrincial.Claims.ToList();
                if (claims.Count == 0) return null;

                return null;

            }
            catch (Exception)
            {

                return null;
            }
            



        }

        public async Task ValidateTAccessToken(TokenValidatedContext context)
        {
            try
            {
                var bearerToken = context.HttpContext.Request.Headers.Authorization;
                var token = bearerToken.ToString().Split(' ')[1];

                if (token.Length == 0)
                {
                    context.Fail("There is not token in header");
                    return;
                }

                var claimsPrincipal = new JwtSecurityTokenHandler().ValidateToken(
                    token, new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidIssuer = _config["Authentication:Issuer"],
                        ValidateAudience = false,
                        ValidAudience = _config["Authentication:Audience"],
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Authentication:Key"])),
                        RequireExpirationTime = true,
                        ClockSkew = TimeSpan.Zero
                    },
                    out _
                    );
                var claims = context.Principal.Claims.ToList();
                if(claims.Count == 0)
                {
                    context.Fail("There is no any information");
                    return;
                }

                ClaimsIdentity identity = context.Principal.Identity as ClaimsIdentity;
                if(identity.FindFirst(JwtRegisteredClaimNames.Iss) == null || identity.FindFirst(JwtRegisteredClaimNames.Exp) == null)
                {
                    context.Fail("Token is invalid");
                    return;
                }

                string email = identity.FindFirst("Email").ToString().Split(':')[1];
                User user = await _userRespository.Queryable().Where(u => u.Email.Equals(email.Trim())).FirstOrDefaultAsync();
                if(user is null)
                {
                    context.Fail("Not found user");
                    return;
                }

                context.Success();
            }
            catch (Exception ex)
            {

                context.Fail("Token was expired" + ex.Message);
                return;
            }
            

        }
    }
}
