using AutoMapper;
using back_end.DTO;
using back_end.Enity;
using back_end.Models.Response;
using back_end.Respositories.Implement;
using back_end.Respositories.Interface;
using back_end.Service.Interface;
using Microsoft.EntityFrameworkCore;

namespace back_end.Service.Implement
{
    public class AssignmentService : IAssignmentService
    {
        private IMapper _mapper;
        private IAssignmentRespository _assignmentRespository;
        private IEmployeeRespository _employeeRespository;

        public AssignmentService(
            IMapper mapper, 
            IAssignmentRespository assignmentRespository,
            IEmployeeRespository employeeRespository
            )
        {
            _mapper = mapper;
            _assignmentRespository = assignmentRespository;
            _employeeRespository = employeeRespository;

        }

        public async Task<AppResponse<AssignmentDTO>> Create(AssignmentDTO data)
        {
            var result = new AppResponse<AssignmentDTO>();
            try
            {
                var mentor = await _employeeRespository.
                    FindBy(emp => !emp.IsDelete && emp.Id == data.MentorId)
                    .FirstOrDefaultAsync();
                if (mentor is null) return  result.BuilderError("Not found mentor");

                var intern = await _employeeRespository.
                    FindBy(emp => !emp.IsDelete && emp.Id == data.InternId)
                    .FirstOrDefaultAsync();
                if (intern is null) return result.BuilderError("Not found intern");

                Assignment? assignment = await _assignmentRespository
                    .FindBy(assign => !assign.IsDelete 
                        && assign.InternId == data.InternId 
                        && assign.MentorId == data.MentorId)
                    .FirstOrDefaultAsync();

                if (assignment != null) return result.BuilderError("This Assignment is exist!");
                assignment = new Assignment();
                assignment = _mapper.Map<Assignment>(data);
                assignment.InitialEnity();
                assignment.Score = 0;

                await _assignmentRespository.Insert(assignment);
                return result.BuilderResult(_mapper.Map<AssignmentDTO>(assignment),"Success");
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
                return result.BuilderResult("Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError("Error: " + ex.Message);
            }
        }

        public async Task<AppResponse<List<AssignmentDTO>>> GetAll()
        {
            var result = new AppResponse<List<AssignmentDTO>>();
            try
            {
                return result.BuilderResult("Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError("Error: " + ex.Message);
            }
        }

        public async Task<AppResponse<AssignmentDTO>> Update(AssignmentDTO data)
        {
            var result = new AppResponse<AssignmentDTO>();
            try
            {
                return result.BuilderResult("Success");
            }
            catch (Exception ex)
            {
                return result.BuilderError("Error: " + ex.Message);
            }
        }
    }
}
