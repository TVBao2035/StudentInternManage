using back_end.Common.Enity;
using back_end.Enum;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Enity
{
    [Table("Tasks")]
    public class Tasks:BaseEntity
    {
        public string Name { get; set; }
        public string Note { get; set; }
        [ForeignKey("Assignment")]
        public Guid AssignmentId { get; set; }
        public Assignment? Assignment { get; set; }
        public TasksStatus Status { get; set; }
    }
}
