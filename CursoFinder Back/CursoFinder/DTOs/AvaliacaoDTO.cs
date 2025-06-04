namespace CursoFinder.DTOs
{
    public class AvaliacaoDTO
    {
        public int CursoId { get; set; }
        public int Nota { get; set; }
        public string Comentario { get; set; } = string.Empty;
    }
}
