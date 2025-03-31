using back_end.Common.Enity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Enity
{
    [Table("Technology")]
    public class Technology: BaseEntity
    {
        public string Name { get; set; }
        public List<Post>? Posts { get; set; }
    }
}
