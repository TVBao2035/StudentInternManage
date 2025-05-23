namespace back_end.Models.Response
{
    public class SearchResponse<T>
    {
        public int TotalPage { get; set; }
        public int  CurrPage { get; set; }
        public List<T> SearchResults { get; set; }
    }
}
