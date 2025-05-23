using back_end.DTO;

namespace back_end.Models.Request
{
    public class SearchRequest
    {
        public int CurrPage { get; set; } = 1;
        public int PageSize { get; set; } = 5;
        public List<SearchFilter>? Filters { get; set; }
        public SortOrder? SortOrder { get; set; }
    }
}
