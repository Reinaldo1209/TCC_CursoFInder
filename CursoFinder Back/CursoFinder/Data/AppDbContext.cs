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

            // CursoSalvo (como você já tem)
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

            // Relacionamento Curso → User (AdminFaculdade)
            builder.Entity<Curso>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Adicione isso para Avaliacao:
            builder.Entity<Avaliacao>()
                .HasOne(a => a.User)
                .WithMany() // ou com coleção se User tiver Avaliacoes
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Avaliacao>()
                .HasOne(a => a.Curso)
                .WithMany() // ou com coleção se Curso tiver Avaliacoes
                .HasForeignKey(a => a.CursoId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

