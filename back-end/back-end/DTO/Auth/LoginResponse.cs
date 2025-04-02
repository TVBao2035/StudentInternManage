
namespace back_end.DTO.Auth
{
    public class LoginResponse
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public List<string> Roles { get; set; }
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }
}
