using back_end.DTO.UserDTOModel;
using back_end.Enum;

namespace back_end.DTO
{
    public class JobDTO
    {
        public Guid? Id { get; set; }
        public UserDTO? User { get; set; }
        public Guid PostId { get; set; }
        public PostDTO? Post { get; set; }
        public JobStatus? Status { get; set; }
    }
}
