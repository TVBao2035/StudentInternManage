using back_end.Common.Enity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Enity
{
    [Table("PostTechnology")]
    public class PostTechnology:BaseEntity
    {
        [ForeignKey("Post")]
        public Guid PostId { get; set; }
        public Post? Post { get; set; }
        [ForeignKey("Technology")]
        public Guid TechnologyId { get; set; }
        public Technology? Technology { get; set; }
    }
}
