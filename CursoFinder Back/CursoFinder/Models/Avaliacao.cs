using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CursoFinder.Models
{
    public class Avaliacao
    {
        public int Id { get; set; }

        [Required]
        public int CursoId { get; set; }

        [ForeignKey("CursoId")]
        public Curso Curso { get; set; }

        [Required]
        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }

        [Range(1, 5)]
        public int Nota { get; set; }

        public string? Comentario { get; set; }

        public DateTime DataAvaliacao { get; set; } = DateTime.Now;
    }
}
