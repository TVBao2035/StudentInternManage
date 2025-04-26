namespace back_end.Models.Request
{
    public class Filter
    {
        public string FieldName { get; set; } = String.Empty;
        public string Value { get; set; }
        public string? Operation { get; set; }

        public Filter(string fieldName, string value, string? operation)
        {
            FieldName = fieldName;
            Value = value;
            Operation = operation;
        }
        public Filter() { }
    }
}
