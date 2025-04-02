using back_end.Common.Enity;
using back_end.DTO.UserDTOModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Enity
{
    [Table("UserRole")]
    public class UserRole:BaseEntity
    {
        [ForeignKey("User")]
        public Guid UserId { get; set; }
        public User? User { get; set; }
        [ForeignKey("Role")]
        public Guid RoleId { get; set; }
        public Role? Role { get; set; }
    }
}
