namespace back_end.DTO.UserDTOModel
{
    public class UserDTO
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string? SchoolName { get; set; }
        public string? BirthDate { get; set; }
        public bool? Gender { get; set; }
        public List<UserRoleDTO>? UserRole { get; set; }
        public List<RoleDTO>? Roles { get; set; }
    }
}
