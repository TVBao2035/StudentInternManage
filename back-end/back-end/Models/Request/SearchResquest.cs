namespace back_end.Models.Request
{
    public class SearchResquest
    {
        public List<Filter>? Filters { get; set; }
        public Sorter? Sorter { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
    }
}
