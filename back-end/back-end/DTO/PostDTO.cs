using back_end.Enity;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.DTO
{
    public class PostDTO
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public string Context { get; set; }
        public EmployeeDTO? Employee { get; set; }
        public int ExperienceYear { get; set; }
        public DateTime Exprised { get; set; }
        public string? CreatedAt { get; set; }

        public List<TechnologyDTO>? Technologies { get; set; }
    }
}
