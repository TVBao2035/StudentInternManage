using back_end.DTO.User;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Enity
{
    [Table("UserRole")]
    public class UserRole
    {
        [Key]
        public Guid Id { get; set; }
        [ForeignKey("User")]
        public Guid UserId { get; set; }
        public User? User { get; set; }
        [ForeignKey("Role")]
        public Guid RoleId { get; set; }
        public Role? Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdateAt { get; set; }
        public bool IsDelete { get; set; }
    }
}
