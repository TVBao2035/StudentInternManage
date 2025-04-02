using back_end.Common.Enity;
using back_end.Enum;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Enity
{
    [Table("Employee")]
    public class Employee:BaseEntity
    {
        [Required]
        [ForeignKey("User")]
        public Guid UserId { get; set; }
        public User? User { get; set; }
        public EmployeeType Type { get; set; }
    }
}
