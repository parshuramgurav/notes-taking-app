using Microsoft.EntityFrameworkCore;
using capstone.web.api.Entities;

namespace capstone.web.api
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Note> Notes { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<NoteCategory> NoteCategories { get; set; }
        public DbSet<User> Users { get; set; }

       
    }
}