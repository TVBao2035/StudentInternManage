using back_end.Enity;
using Microsoft.EntityFrameworkCore;

namespace back_end.Data
{
    public class ApplicationDBContext:DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options): base(options)
        {

        }

        public DbSet<User> User { get; set; }
        public DbSet<Role> Role { get; set; }
        public DbSet<UserRole> UserRole { get; set; }
        public DbSet<Token> Token { get; set; }
        public DbSet<Technology> Technologie { get; set; }
        public DbSet<Post> Post { get; set; }
        public DbSet<PostTechnology> PostTechnologie { get; set; }
        public DbSet<Job> Job { get; set; }
        public DbSet<Employee> Employee { get; set; }
        public DbSet<Assignment> Assignment { get; set; }
        public DbSet<Certifications> Certifications { get; set; }
        public DbSet<Tasks> Tasks { get; set; }
    }

}
