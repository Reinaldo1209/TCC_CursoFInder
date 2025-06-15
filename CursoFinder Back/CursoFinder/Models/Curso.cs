using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
namespace CursoFinder.Models
{
    public class Curso
    {
        public int Id { get; set; }
        public string? Titulo { get; set; }
        public string? Tipo { get; set; }
        public string? Localização { get; set; }
        public string? Descricao { get; set; }
        public string? Instituicao { get; set; }
        public string? CargaHoraria { get; set; }
        public string? Valor { get; set; }
        public string? Link { get; set; }

        public string? UserId { get; set; }
        public User? User { get; set; }

        public ICollection<Avaliacao> Avaliacoes { get; set; } = new List<Avaliacao>();
    }
}
