using AutoMapper;
using back_end.DTO;
using back_end.Enity;
using back_end.Models.Response;
using back_end.Respositories.Interface;
using back_end.Service.Interface;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace back_end.Service.Implement
{
    public class TechnologyService : ITechnologyService
    {
        private ITechnologyRespository _technologyRespository;
        private IMapper _mapper;

        public TechnologyService(ITechnologyRespository technologyRespository, IMapper mapper)
        {
            _technologyRespository = technologyRespository;
            _mapper = mapper;
        }

        public async Task<AppResponse<TechnologyDTO>> Create(TechnologyDTO technology)
        {
            var result = new AppResponse<TechnologyDTO>();
            try
            {
                var tech = await _technologyRespository
                    .FindBy(t => t.Name.ToLower().Equals(technology.Name.ToLower()))
                    .FirstOrDefaultAsync();

                if (tech != null) return result.BuilderError("Technology is exiting");

                Technology newTech = _mapper.Map<Technology>(technology);
                newTech.InitialEnity();
                await _technologyRespository.Insert(newTech);
                return result.BuilderResult(_mapper.Map<TechnologyDTO>(newTech),"Success");
            }
            catch (Exception ex)
            {

                return result.BuilderError("Error " + ex.Message);
            }
        }

        public async  Task<AppResponse<bool>> Delete(Guid technologyId)
        {
            var result = new AppResponse<bool>();
            try
            {
                var tech = await _technologyRespository.FindBy(t => t.Id == technologyId && !t.IsDelete).FirstOrDefaultAsync();
                if (tech is null) return result.BuilderError("Not found technology");

                tech.DeleteEnity();
                await _technologyRespository.Update(tech);

                return result.BuilderResult("Delete success");
            }
            catch (Exception ex)
            {

                return result.BuilderError("Error " + ex.Message);
            }
        }

        public async  Task<AppResponse<List<TechnologyDTO>>> GetAll()
        {
            var result = new AppResponse<List<TechnologyDTO>>();
            try
            {
                var listTech = await _technologyRespository.Queryable()
                    .Where(t => !t.IsDelete)
                    .Select(t => _mapper.Map<TechnologyDTO>(t))
                    .ToListAsync();
                return result.BuilderResult(listTech, "Success");
            }
            catch (Exception ex)
            {

                return result.BuilderError("Error " + ex.Message);
            }
        }

        public async  Task<AppResponse<TechnologyDTO>> Update(TechnologyDTO technology)
        {
            var result = new AppResponse<TechnologyDTO>();
            try
            {
                var tech = await _technologyRespository
                    .FindBy(t => t.Id == technology.Id && !t.IsDelete && !t.Name.ToLower().Equals(technology.Name))
                    .FirstOrDefaultAsync();
                if (tech is null) return result.BuilderError("Technology is invalid");

                tech.Name = technology.Name;
                tech.UpdateTimeEntity();
                await _technologyRespository.Update(tech);
                return result.BuilderResult( technology, "Success");
            }
            catch (Exception ex)
            {

                return result.BuilderError("Error " + ex.Message);
            }
        }
    }
}
