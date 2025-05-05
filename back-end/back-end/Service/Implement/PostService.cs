using AutoMapper;
using back_end.Common;
using back_end.DTO;
using back_end.DTO.UserDTOModel;
using back_end.Enity;
using back_end.Enum;
using back_end.Models.Response;
using back_end.Respositories.Implement;
using back_end.Respositories.Interface;
using back_end.Service.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace back_end.Service.Implement
{
    public class PostService : IPostService
    {
        private IPostRespository _postRespository;
        private IPostTechnologyRespository _postTechnologyRespository;
        private ITechnologyRespository _technologyRespository;
        private IEmployeeRespository _employeeRespository;
        private IHttpContextAccessor _contextAccessor;
        private IUserRespository _userRespository;
        private IUserService _userService;
        private IMapper _mapper;

        public PostService(
            IPostRespository postRespository, 
            IPostTechnologyRespository postTechnologyRespository,
            ITechnologyRespository technologyRespository,  
            IEmployeeRespository employeeRespository,
            IHttpContextAccessor contextAccessor,
            IUserRespository userRespository,
            IUserService userService,
            IMapper mapper)
        {
            _postRespository = postRespository;
            _postTechnologyRespository = postTechnologyRespository;
            _technologyRespository = technologyRespository;
            _employeeRespository = employeeRespository;
            _contextAccessor = contextAccessor;
            _userRespository = userRespository;
            _userService = userService;
            _mapper = mapper;
        }

        public async Task<AppResponse<PostDTO>> Create(PostDTO post)
        {
            var result = new AppResponse<PostDTO>();
            try
            {

                User user = await _userService.GetUserFromToken();
                if (user is null)
                    return result.BuilderError("Can't found user from token");

                // ------------ check employee and  permission -------------- //
                var employee = await _employeeRespository
                    .FindBy(em => !em.IsDelete && em.UserId == user.Id)
                    .FirstOrDefaultAsync();
                if( employee is null || employee.Type != EmployeeType.OfficalEmployee) 
                    return result.BuilderError("You don't have permission");


                // -------- saving new employee ---------------//
                Post newPost = _mapper.Map<Post>(post);
                newPost.InitialEnity();
                newPost.EmployeeId = employee.Id;
                await _postRespository.Insert(newPost);

                // -------- saving post of technologies ------- //
                List<PostTechnology> postTechnologyList = new List<PostTechnology>();
                var techList = post.Technologies?.Select(t => _mapper.Map<Technology>(t)).ToList();
                post.Id = newPost.Id;
                post.Technologies = [];
                if(techList != null)
                {
                    foreach (var technology in techList)
                    {
                        var tech = await _technologyRespository.FindBy(t => t.Id == technology.Id && !t.IsDelete).FirstOrDefaultAsync();
                        if (tech != null){
                            var postTechnology = new PostTechnology();
                            postTechnology.InitialEnity();
                            postTechnology.PostId = newPost.Id;
                            postTechnology.TechnologyId = tech.Id;
                            post.Technologies.Add(_mapper.Map<TechnologyDTO>(tech));
                            postTechnologyList.Add(postTechnology);
                        }
                    }
                    await _postTechnologyRespository.Insert(postTechnologyList);
                }
                post.CreatedAt = Helper.GetNowDateString();
                return result.BuilderResult(post,"Success");
            }
            catch (Exception ex)
            {

                return result.BuilderError("Error " + ex.Message);
            }
        }

        public async Task<AppResponse<bool>> Delete(Guid postId)
        {
            var result = new AppResponse<bool>();
            try
            {
                User user = await _userService.GetUserFromToken();
                if (user is null)
                    return result.BuilderError("Not found user from token");

                var post = await _postRespository.FindBy(p => p.Id == postId).Include(p=>p.Employee).FirstOrDefaultAsync();
                if (post is null) return result.BuilderError("Not found post");

                if (post.Employee.UserId != user.Id && !_userService.checkRole())
                    return result.BuilderError("You are not Author of this post");
                post.DeleteEnity();
                await _postRespository.Update(post);

                return result.BuilderResult("Success");
            }
            catch (Exception ex)
            {

                return result.BuilderError("Error " + ex.Message);
            }
        }

        public async Task<AppResponse<List<PostDTO>>> GetAll()
        {
            var result = new AppResponse<List<PostDTO>>();
            try
            {
                var posts = await _postRespository.FindBy(p => !p.IsDelete)
                    .Select(p => new PostDTO
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Context = p.Context,
                        ExperienceYear = p.ExperienceYear,
                        Exprised = p.Exprised,
                        CreatedAt = p.CreatedAt.ToString("dd/MM/yyyy"),
                        Technologies = p.PostTechnologies
                        .Where(pt => !pt.IsDelete && pt.PostId == p.Id)
                        .Select(pt => _mapper.Map<TechnologyDTO>(pt.Technology)).ToList(),
                        Employee = new EmployeeDTO {
                            Id = p.EmployeeId,
                            Type = p.Employee.Type,
                            UserId = p.Employee.UserId,
                            User = _mapper.Map<UserDTO>(p.Employee.User)
                        }

                    }).ToListAsync();

                return result.BuilderResult(posts,"Success");
            }
            catch (Exception ex)
            {

                return result.BuilderError("Error " + ex.Message);
            }
        }

        public async Task<AppResponse<PostDTO>> GetById(Guid id)
        {
            var result = new AppResponse<PostDTO>();
            try
            {
                var post = await _postRespository
                    .FindBy(p => !p.IsDelete && p.Id == id)
                    .Include(p => p.PostTechnologies)
                    .Select(p => new PostDTO
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Context = p.Context,
                        ExperienceYear = p.ExperienceYear,
                        Exprised = p.Exprised,
                       // CreatedAt = Helper.FormatDate(p.CreatedAt),
                        Technologies = p.PostTechnologies.Where(pt => !pt.IsDelete).Select(pt => _mapper.Map<TechnologyDTO>(pt.Technology)).ToList()
                    })
                    .FirstOrDefaultAsync();

                return result.BuilderResult(post,"Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError("Error: " + ex.Message);
            }
        }

        public async Task<AppResponse<PostDTO>> Update(PostDTO post)
        {
            var result = new AppResponse<PostDTO>();
            try
            {
                Post? data = await _postRespository
                    .FindBy(p => !p.IsDelete && p.Id == post.Id)
                    .Include(p => p.Employee)
                    .Include(p=>p.PostTechnologies).ThenInclude(pt => pt.Technology)
                    .FirstOrDefaultAsync();
                if (data is null) return result.BuilderError("Not found post");

                User user = await _userService.GetUserFromToken();
                if (user is null)
                    return result.BuilderError("Can't found user from token");

                if (user.Id != data.Employee.UserId && !_userService.checkRole())
                    return result.BuilderError("You are not Author of this Post");

                // ----------- Update information post ------------------- //

                data.Context = post.Context;
                data.Name = post.Name;
                data.ExperienceYear = post.ExperienceYear;
                data.Exprised = post.Exprised;

                await _postRespository.Update(data);

                // ---------- Get all technology id of post --------------- //
                var oldTechPostList = data.PostTechnologies.Select(pt => pt.TechnologyId);
                var newTechPostList = post.Technologies.Select(t => _mapper.Map<Technology>(t)).Select(t=>t.Id);
                var addPostTechnologyList = new List<PostTechnology>();
                var deletePostTechnologyList = new List<PostTechnology>();

                // ----------- Add new technology for post --------------- //
                foreach(var tectId in newTechPostList)
                {
                    if (!oldTechPostList.Contains(tectId))
                    {
                        PostTechnology postTechnology = new PostTechnology();
                        postTechnology.InitialEnity();
                        postTechnology.PostId = data.Id;
                        postTechnology.TechnologyId = tectId;
                        addPostTechnologyList.Add(postTechnology);
                    }
                }
                await _postTechnologyRespository.Insert(addPostTechnologyList);
                // --------------- Delete technology for post ------------ //
                foreach(var techId in oldTechPostList)
                {
                    if (!newTechPostList.Contains(techId))
                    {
                        PostTechnology? postTechnology = await _postTechnologyRespository
                             .FindBy(pt => !pt.IsDelete && pt.TechnologyId == techId && pt.PostId == data.Id)
                             .FirstOrDefaultAsync();

                        if (postTechnology != null) 
                            deletePostTechnologyList.Add(postTechnology);
                    }
                }

                await _postTechnologyRespository.Delete(deletePostTechnologyList);
                post = _mapper.Map<PostDTO>(data);
                post.Technologies = await _postTechnologyRespository
                    .FindBy(pt => pt.PostId == data.Id)
                    .Select(pt => _mapper.Map<TechnologyDTO>(pt.Technology)).ToListAsync();
                return result.BuilderResult(post, "Success");
            }
            catch (Exception ex)
            {

                return result.BuilderError("Error " + ex.Message);
            }
        }
    }
}
