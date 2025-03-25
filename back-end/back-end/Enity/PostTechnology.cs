using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Enity
{
    [Table("PostTechnology")]
    public class PostTechnology
    {
        [Key]
        public Guid Id { get; set; }
        [ForeignKey("Post")]
        public Guid PostId { get; set; }
        public Post? Post { get; set; }
        [ForeignKey("Technology")]
        public Guid TechnologyId { get; set; }
        public Technology? Technology { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdateAt { get; set; }
        public bool IsDelete { get; set; }
    }
}
