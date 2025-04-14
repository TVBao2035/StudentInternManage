using back_end.Enity;

namespace back_end.DTO
{
    public class AssignmentDTO
    {
        public Guid? Id {get; set; }
        public Guid InternId { get; set; }
        public Guid MentorId { set; get; }
        public int? Score { get; set; }
        public EmployeeDTO? Intern { get; set; }
        public EmployeeDTO? Mentor { get; set; }
    }
}
