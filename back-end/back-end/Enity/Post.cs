using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Enity
{
    [Table("Post")]
    public class Post
    {
        [Key]
        public Guid Id { get; set; }
        public string Context { get; set; }
        [ForeignKey("Employee")]
        public Guid EmployeeId { get; set; }
        public Employee? Employee { get; set; }
        public int ExperienceYear { get; set; }
        public DateTime Exprised { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdateAt { get; set; }
        public bool isDelete { get; set; }
    }
}
