using System.ComponentModel.DataAnnotations;

namespace back_end.Models.Request
{
    public class Sorter
    {
        [Required]
        public string? FileName { get; set; }
        public bool? IsAscending { get; set; }

        public Sorter(string? fileName, bool? isAscending)
        {
            FileName = fileName;
            IsAscending = isAscending;
        }

        public Sorter() { }
    }
}
