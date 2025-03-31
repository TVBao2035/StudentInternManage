using back_end.Common.Enity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Enity
{
    [Table("Token")]
    public class Token:BaseEntity
    {
        [ForeignKey("User")]
        public Guid UserId { get; set; }
        public User? User { get; set; }
        public string RefreshToken { get; set; }
        public string Code { get; set; }


    }
}
