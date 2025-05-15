using Microsoft.AspNetCore.Mvc;

namespace CursoFinder.Models
{
    public class CursoSalvo
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public int CursoId { get; set; }

        public User Usuario { get; set; } = null!;
        public Curso Curso { get; set; } = null!;
    }
}
