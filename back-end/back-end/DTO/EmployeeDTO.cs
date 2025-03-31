using back_end.DTO.UserDTOModel;
using back_end.Enum;

namespace back_end.DTO
{
    public class EmployeeDTO
    {
        public Guid? Id { get; set; }
        public Guid UserId { get; set; }
        public UserDTO? User { get; set; }
        public EmployeeType Type { get; set; }
    }
}
