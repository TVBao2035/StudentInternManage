using AutoMapper;
using back_end.DTO;
using back_end.DTO.UserDTOModel;
using back_end.Enity;
using back_end.Enum;
using back_end.Models.Request;
using back_end.Models.Response;
using back_end.Respositories.Implement;
using back_end.Respositories.Interface;
using back_end.Service.Interface;
using Microsoft.EntityFrameworkCore;

namespace back_end.Service.Implement
{
    public class JobService : IJobService
    {
        private IJobRespository _jobRespository;
        private IUserRespository _userRespository;
        private IPostRespository _postRespository;
        private IUserService _userService;
        private IMapper _mapper;

        public JobService(
            IJobRespository jobRespository,
            IUserRespository userRespository,
            IPostRespository postRespository,
            IUserService userService, 
            IMapper mapper
            )
        {
            _jobRespository = jobRespository;
            _userRespository = userRespository;
            _postRespository = postRespository;
            _userService = userService;
            _mapper = mapper;
        }

        public async Task<AppResponse<JobDTO>> Create(JobDTO data)
        {
            var result = new AppResponse<JobDTO>();
            try
            {
                var user = await _userService.GetUserFromToken();
                if (user is null) return result.BuilderError("Not found user!");

                var post = await _postRespository.FindBy(p => p.Id == data.PostId && !p.IsDelete).FirstOrDefaultAsync();
                if (post is null) return result.BuilderError("Not found post!");

                Job newJob = new Job();
                newJob.InitialEnity();
                newJob.UserId = user.Id;
                newJob.PostId = post.Id;
                newJob.Status = JobStatus.Sent;
                
                await _jobRespository.Insert(newJob);

                data = _mapper.Map<JobDTO>(newJob);
                data.Post = _mapper.Map<PostDTO>(post);
                return result.BuilderResult( data, "Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError("Error: " + ex.Message);
            }
        }

        public async Task<AppResponse<bool>> Delete(Guid id)
        {
            var result = new AppResponse<bool>();
            try
            {
                var job = await _jobRespository.FindBy(j => !j.IsDelete && j.Id == id).FirstOrDefaultAsync();
                if (job is null) return result.BuilderError("Not found Job!");

                var user = await _userService.GetUserFromToken();
                if (user.Id != job.UserId) return result.BuilderError("Account has not permission");

                job.DeleteEnity();
                await _jobRespository.Update(job);

                return result.BuilderResult("Delete Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError("Error: " + ex.Message);
            }
        }

        public async Task<AppResponse<List<JobDTO>>> GetAll()
        {
            var result = new AppResponse<List<JobDTO>> ();
            try
            {
                List<JobDTO> listJobs = await _jobRespository.FindBy(j => !j.IsDelete)
                    .Select(j => new JobDTO
                    {
                        Id = j.Id,
                        PostId = j.PostId,
                        Post = _mapper.Map<PostDTO>(j.Post),
                        Status = j.Status,
                        User = _mapper.Map<UserDTO>(j.User)
                    }).ToListAsync();
                return result.BuilderResult(listJobs, "Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError("Error: " + ex.Message);
            }
        }

        public Task<AppResponse<SearchResponse<JobDTO>>> Search(SearchResquest resquest)
        {
            throw new NotImplementedException();
        }

        public async Task<AppResponse<JobDTO>> Update(JobDTO data)
        {
            var result = new AppResponse<JobDTO>();
            try
            {
                var job = await _jobRespository.FindBy(j => !j.IsDelete && j.Id == data.Id).FirstOrDefaultAsync();
                if (job is null) return result.BuilderError("Not found Job");

                job.Status = data.Status is null ? job.Status : _mapper.Map<Job>(data).Status;
                job.UpdateTimeEntity();
                await _jobRespository.Update(job);

                return result.BuilderResult(_mapper.Map<JobDTO>(job) ,"Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError("Error: " + ex.Message);
            }
        }
    }
}
