using AutoMapper;
using back_end.Common;
using back_end.Common.PasswordHasher;
using back_end.DTO.Auth;
using back_end.DTO.UserDTOModel;
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
        private IHttpContextAccessor _contextAccessor;
        private IConfiguration _config;


        public UserService(IUserRespository userRespository,
            IConfiguration config,
            IMapper mapper,
            IPasswordHasher passwordHasher,
            ITokenRespository tokenRespository,
            IRoleRespository roleRespository,
            IHttpContextAccessor contextAccessor,
            IUserRoleRespository userRoleRespository
            )
        {
            _userRespository = userRespository;
            _mapper = mapper;
            _passwordHasher = passwordHasher;
            _roleRespository = roleRespository;
            _userRoleRespository = userRoleRespository;
            _tokenResposirory = tokenRespository;
              _contextAccessor = contextAccessor;
            _config = config;
        }
        // ------- Account other ------ //
        public async Task<AppResponse<LoginResponse>> Login(LoginRequest data)
        {
            var result = new AppResponse<LoginResponse>();
            try
            {
                var user = await _userRespository.Queryable().Where(u => u.Email == data.Email && !u.IsDelete).FirstOrDefaultAsync();

                if (user == null) return result.BuilderError("Login is not success");
     
                if (!_passwordHasher.Verity(user.Password, data.Password))
                {
                    return result.BuilderResult("Password is wrong");
                }
                
                (string accessToken, DateTime accessTokenExpired) = await CreateAccessToken(user);
                (string refreshToken, DateTime refreshTokenExpired, string code) = await CreateRefreshToken(user);

                Token token = new Token();
                token.Code = code;
                token.RefreshToken = refreshToken;
                token.UserId = user.Id;
                token.InitialEnity();
                await _tokenResposirory.Insert(token);

                var loginResponse = new LoginResponse();
                loginResponse.RefreshToken = refreshToken;
                loginResponse.AccessToken = accessToken;
                loginResponse.Name = user.Name;
                loginResponse.Email = user.Email;
                loginResponse.Roles = await _userRoleRespository
                    .Queryable()
                    .Where(ur => ur.UserId == user.Id && !ur.IsDelete)
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
                if (!Helper.ValidateEmail(data.Email))
                {
                    return result.BuilderError("Email is invalid");
                }

                if (Helper.IsPhoneNumber(data.PhoneNumber))
                {
                    return result.BuilderError("Phone is invalid");
                }
                User? newUser = await _userRespository.Queryable()
                    .Where(user => !user.IsDelete)
                    .FirstOrDefaultAsync(user => user.Email.Equals(data.Email) || user.PhoneNumber.Equals(data.PhoneNumber));

                if (newUser != null) return result.BuilderError("Account has register already");

                newUser = _mapper.Map<User>(data);
                newUser.InitialEnity();
                newUser.Password = _passwordHasher.Hash(newUser.Password);

                Role role = await _roleRespository.Queryable().FirstAsync(r => r.Name.Equals("student"));
                if (role is null) 
                    return result.BuilderError("Error");

                UserRole userRole = new UserRole();
                userRole.InitialEnity();

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
                    .Select(u => new UserDTO
                    {
                        Id = u.Id,
                        Name = u.Name,
                        BirthDate = u.BirthDate,
                        Email = u.Email,
                        Gender = u.Gender,
                        PhoneNumber = u.PhoneNumber,
                        SchoolName = u.SchoolName,
                        Roles = u.UserRoles.Where(ur => !ur.IsDelete && ur.UserId == u.Id)
                        .Select(ur => _mapper.Map<RoleDTO>(ur.Role)).ToList()
                    }).ToListAsync();
                
               
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
                User user;
                bool isAdmin = checkRole();

                if (isAdmin)
                {
                    user = await _userRespository.Queryable()
                        .Where(u => u.Id == data.Id && !u.IsDelete)
                        .FirstOrDefaultAsync();
                }
                else
                {
                    user = await GetUserFromToken();
                }

                if(user is null ) return result.BuilderError("User id is invalid");

                var checkEmail = await _userRespository.FindBy(u => u.Email.Equals(data.Email)).FirstOrDefaultAsync();
                var checkPhone = await _userRespository.FindBy(u => u.PhoneNumber.Equals(data.PhoneNumber)).FirstOrDefaultAsync();

                // -----  update infor user ----
                if(checkEmail is null && isAdmin) user.Email = data.Email;

                if (checkPhone is null) user.PhoneNumber = data.PhoneNumber;

                user.Name = data.Name;
                user.BirthDate = data.BirthDate;
                user.Gender = data.Gender;
                user.UpdateTimeEntity();

                await _userRespository.Update(user);

                if (isAdmin)
                {
                    // --------- Get all role of user ---------
                    List<Guid> roles = await _userRoleRespository
                        .FindBy(ur => ur.UserId == user.Id)
                        .Select(ur => ur.RoleId).ToListAsync();

                    bool isCheck = false;
                    UserRole? userole = new UserRole();

                    // ----- Delete role from user ------
                    foreach(var role in roles)
                    {
                        isCheck = data.Roles.Select(r => r.Id).ToList().Contains(role);
                        if (!isCheck)
                        {
                            // delete user - role
                            userole = await _userRoleRespository.Queryable()
                                .Where(ur => ur.UserId == user.Id && ur.RoleId == role)
                                .FirstOrDefaultAsync();
                            await _userRoleRespository.Delete(userole);
                        }
                    }
                    // ----- Add new Role for user ------
                    var roldIdList = data.Roles.Select(r => _mapper.Map<Role>(r)).Select(r => r.Id).ToList();
                    foreach (var role in roldIdList)
                    {
                        isCheck = roles.Contains(role);
                        if (!isCheck)
                        {
                            userole = new UserRole();
                            userole.InitialEnity();
                            userole.UserId = user.Id;
                            userole.RoleId = role;
                            await _userRoleRespository.Insert(userole);
                        }
                    }

                }

                return result.BuilderResult(data, "Success");
                
            }
            catch (Exception ex)
            {

                return result.BuilderError(ex.Message);
            }
        }

        public async Task<AppResponse<UserDTO>> Create(UserDTO data)
        {
            var result = new AppResponse<UserDTO>();
            try
            {
                User user = await _userRespository.Queryable()
                     .Where(u => (u.Email == data.Email || u.PhoneNumber == data.PhoneNumber) && !u.IsDelete).FirstOrDefaultAsync();
                if (user != null) return result.BuilderError("Account was exiting");

                user = _mapper.Map<User>(data);
                user.InitialEnity();
                user.Password = _passwordHasher.Hash("12345");
                await _userRespository.Insert(user);

                UserRole userRole;
                List<UserRole> userRoleList = new List<UserRole>();
                data.Roles?.Select(r => _mapper.Map<Role>(r)).ToList().ForEach( role =>
                {
                    userRole = new UserRole();
                    userRole.InitialEnity();
                    userRole.UserId = user.Id;
                    userRole.RoleId = role.Id;
                    userRoleList.Add(userRole);
                });
                await _userRoleRespository.Insert(userRoleList);
                return result.BuilderResult("Create Account Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError(ex.Message);
            }
        }

        public async Task<AppResponse<UserDTO>> Delete(Guid userId)
        {
            var result = new AppResponse<UserDTO>();
            try
            {
                User user = await _userRespository.FindBy(u => u.Id == userId).FirstOrDefaultAsync();
                if(user is null) return result.BuilderError("Not found user");

                user.IsDelete = true;
                await _userRespository.Update(user);
                return result.BuilderResult("Delete User Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError(ex.Message);
            }
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
            DateTime expired = DateTime.UtcNow.AddHours(5);
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

        public  bool checkRole(string roleName = "admin")
        {
            ClaimsIdentity identity = _contextAccessor.HttpContext.User.Identity as ClaimsIdentity;
            var accountRoles = identity.FindAll("Roles").ToList();
            foreach (var item in accountRoles)
                if (item.ToString().Split(':')[1].Trim().ToLower().Equals(roleName.ToLower()))
                    return true;
            return false;
        }

        public async Task<User> GetUserFromToken()
        {
            try
            {
                ClaimsIdentity identity = _contextAccessor.HttpContext.User.Identity as ClaimsIdentity;
                string email = identity.FindFirst("Email").ToString().Split(':')[1].Trim();
                User user =  await _userRespository.FindBy(u => u.Email.ToLower().Equals(email.ToLower())).FirstOrDefaultAsync();
                return user;
            }
            catch (Exception)
            {

                return null;
            }
            
        }

        public async Task<AppResponse<UserDTO>> GetById(Guid id)
        {
            var result = new AppResponse<UserDTO>();
            try
            {
                var user = await GetUserFromToken();
                if (user.Id != id && !checkRole("manager"))
                    return result.BuilderError("You don't have permisson");

             

                return result.BuilderResult(_mapper.Map<UserDTO>(user),"Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError("Error" +  ex.Message);
            }
        }
    }
}
