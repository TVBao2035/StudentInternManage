using System.ComponentModel.DataAnnotations;

namespace back_end.Common.Enity
{
    public class BaseEntity
    {
        [Key]
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsDelete { get; set; }

        public void InitialEnity()
        {
            Id = Guid.NewGuid();
            CreatedAt = Helper.FormatDate(DateTime.Now);
            UpdatedAt = Helper.FormatDate(DateTime.Now);
            IsDelete = false;
        }

        public void UpdateTimeEntity()
        {
            UpdatedAt = Helper.FormatDate(DateTime.Now);
        }

        public void DeleteEnity()
        {
            IsDelete = true;
        }
    }
}
