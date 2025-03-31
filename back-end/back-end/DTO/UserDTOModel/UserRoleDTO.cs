using back_end.Enity;

namespace back_end.DTO.UserDTOModel
{
    public class UserRoleDTO
    {
        public Guid? Id { get; set; }
        public Guid UserId { get; set; }
        public Guid RoleId { get; set; }
        public RoleDTO? Role { get; set; }
    }
}
