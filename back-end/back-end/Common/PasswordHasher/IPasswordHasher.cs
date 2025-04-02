namespace back_end.Common.PasswordHasher
{
    public interface IPasswordHasher
    {
        public string Hash(string password);
        public bool Verity(string passwordHash, string password);
    }
}
