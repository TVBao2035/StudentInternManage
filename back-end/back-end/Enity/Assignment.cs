using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Enity
{
    [Table("Assignment")]
    public class Assignment
    {
        [Key]
        public Guid Id { get; set; }

        [ForeignKey("Intern")]
        public Guid InternId;
        public Employee? Intern { get; set; }

        [ForeignKey("Mentor")]
        public Guid MentorId;   
        public Employee? Mentor { get; set; }

        public int Score { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdateAt { get; set; }
        public bool IsDelete { get; set; }
    }
}
