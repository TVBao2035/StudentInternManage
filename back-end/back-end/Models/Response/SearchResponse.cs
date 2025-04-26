namespace back_end.Models.Response
{
    public class SearchResponse<T>
    {
        public int PageCurrent { set; get; }
        public int PageSize { get; set; }
        public List<T>? Data { get; set; }

    }
}
