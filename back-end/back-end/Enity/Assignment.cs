using back_end.Common.Enity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Enity
{
    [Table("Assignment")]
    public class Assignment:BaseEntity
    {
        [ForeignKey("Intern")]
        public Guid InternId;
        public Employee? Intern { get; set; }

        [ForeignKey("Mentor")]
        public Guid MentorId;   
        public Employee? Mentor { get; set; }

        public int Score { get; set; }
    }
}
