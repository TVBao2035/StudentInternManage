using back_end.Enity;
using back_end.Enum;

namespace back_end.DTO
{
    public class TaskDTO
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public string Note { get; set; }
        public Guid AssignmentId { get; set; }
        public AssignmentDTO? Assignment { get; set; }
        public TasksStatus? Status { get; set; }
    }
}
