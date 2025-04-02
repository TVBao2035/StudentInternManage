using back_end.Common.Enity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Enity
{
    [Table("Certifications")]
    public class Certifications:BaseEntity
    {
        [ForeignKey("Employee")]
        public Guid EmployeeId { get; set; }
        public Employee? Employee { get; set; }
    }
}
