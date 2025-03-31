using back_end.Common.Enity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Enity
{
    [Table("Post")]
    public class Post:BaseEntity
    {
        public string Name { get; set; }
        public string Context { get; set; }
        [ForeignKey("Employee")]
        public Guid EmployeeId { get; set; }
        public Employee? Employee { get; set; }
        public int ExperienceYear { get; set; }
        public DateTime Exprised { get; set; }
        public List<PostTechnology>? PostTechnologies { get; set; }
    }
}
