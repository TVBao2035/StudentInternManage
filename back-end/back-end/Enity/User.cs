using back_end.Common.Enity;
using back_end.DTO.UserDTOModel;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Enity
{
    [Table("User")]
    public class User:BaseEntity
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string PhoneNumber { get; set; }
        public  string? SchoolName { get; set; }
        public bool? Gender { get; set; }
        public string? BirthDate { get; set; }
        public List<UserRole>? UserRoles { get; set; }
    }
}
