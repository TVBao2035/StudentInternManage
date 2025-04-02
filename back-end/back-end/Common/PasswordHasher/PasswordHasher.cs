using System.Security.Cryptography;

namespace back_end.Common.PasswordHasher
{
    public class PasswordHasher : IPasswordHasher
    {

        private const int SaltSize = 128 / 8;
        private const int KeySize = 256 / 8;
        private const int Iteration = 100000;
        private static readonly HashAlgorithmName hashAlgorithmName = HashAlgorithmName.SHA256;
        private const char Delimiter = ';';
        public string Hash(string password)
        {
            var salt = RandomNumberGenerator.GetBytes(SaltSize);
            var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iteration, hashAlgorithmName, KeySize);
            return string.Join(Delimiter, Convert.ToBase64String(salt), Convert.ToBase64String(hash));
        }

        public bool Verity(string passwordHash, string password)
        {
            var elements = passwordHash.Split(Delimiter);
            var salt = Convert.FromBase64String(elements[0]);
            var hash = Convert.FromBase64String(elements[1]);
            var pass_has = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iteration, hashAlgorithmName, KeySize);
            return CryptographicOperations.FixedTimeEquals(hash, pass_has);
        }
    }
}
