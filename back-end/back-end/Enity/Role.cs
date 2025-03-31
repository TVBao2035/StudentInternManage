using back_end.Common.Enity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Enity
{
    [Table("Role")]
    public class Role:BaseEntity
    {
        [Required]
        public string Name { get; set; }
        public List<User>? Users { get; set; }
    }
}
