namespace back_end.Models.Response
{
    public class AppResponse<T>
    {
        public T Data { get; set; }
        public string Message { get; set; }
        public bool IsSuccess { get; set; }

        public AppResponse<T> BuilderResult(T Data, string Message)
        {
            this.Data = Data;
            this.Message = Message;
            IsSuccess = true;
            return this;
        }


        public AppResponse<T> BuilderResult(string Message)
        {
            this.Message = Message;
            IsSuccess = true;
            return this;
        }


        public AppResponse<T> BuilderError(string Message)
        {
            this.Message = Message;
            IsSuccess = false;
            return this;
        }

    }
}
