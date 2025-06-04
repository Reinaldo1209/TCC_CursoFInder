using CursoFinder.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CursoFinder.Data
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Curso> Cursos { get; set; }
        public DbSet<CursoSalvo> CursosSalvos { get; set; }
        public DbSet<Avaliacao> Avaliacoes { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // CursoSalvo - índice único para impedir duplicidade de salvamento
            builder.Entity<CursoSalvo>()
                .HasIndex(cs => new { cs.UserId, cs.CursoId })
                .IsUnique();

            builder.Entity<CursoSalvo>()
                .HasOne(cs => cs.Usuario)
                .WithMany(u => u.CursosSalvos)
                .HasForeignKey(cs => cs.UserId);

            builder.Entity<CursoSalvo>()
                .HasOne(cs => cs.Curso)
                .WithMany()
                .HasForeignKey(cs => cs.CursoId);
        }
    }
}

