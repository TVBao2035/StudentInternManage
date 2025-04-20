using back_end.Common.Enity;
using back_end.Enum;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Enity
{
    [Table("Job")]
    public class Job:BaseEntity
    {
       [ForeignKey("User")]
        public Guid UserId { get; set; }
        public User? User { get; set; }

        [ForeignKey("Post")]
        public Guid PostId { get; set; }
        public Post? Post { get; set; }

        public JobStatus Status { get; set; }
    }
}
