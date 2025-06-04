using Microsoft.AspNetCore.Identity;

namespace CursoFinder.Models
{
    public class User : IdentityUser
    {
        public ICollection<CursoSalvo> CursosSalvos { get; set; } = new List<CursoSalvo>();
        public ICollection<Avaliacao> Avaliacoes { get; set; } = new List<Avaliacao>();

    }
}
