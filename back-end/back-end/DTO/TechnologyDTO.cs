namespace back_end.DTO
{
    public class TechnologyDTO
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public List<PostDTO>? Posts { get; set; }
    }
}
