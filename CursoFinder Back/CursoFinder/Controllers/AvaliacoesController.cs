using CursoFinder.Data;
using CursoFinder.DTOs;
using CursoFinder.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AvaliacoesController : ControllerBase
{
    private readonly AppDbContext _context;

    public AvaliacoesController(AppDbContext context)
    {
        _context = context;
    }

    [Authorize(Roles = "Usuario")]
    [HttpPost]
    public async Task<IActionResult> AvaliarCurso([FromBody] AvaliacaoDTO dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized("Usuário não autenticado.");

        // Verifica se o usuário já avaliou este curso
        if (await _context.Avaliacoes.AnyAsync(a => a.UserId == userId && a.CursoId == dto.CursoId))
        {
            return BadRequest("Você já avaliou este curso.");
        }

        var avaliacao = new Avaliacao
        {
            CursoId = dto.CursoId,
            Nota = dto.Nota,
            Comentario = dto.Comentario,
            UserId = userId,
            DataAvaliacao = DateTime.Now
        };

        _context.Avaliacoes.Add(avaliacao);
        await _context.SaveChangesAsync();

        return Ok("Avaliação registrada com sucesso.");
    }


    // Público (anônimo pode consultar as avaliações de um curso)
    [AllowAnonymous]
    [HttpGet("{cursoId}")]
    public async Task<IActionResult> GetAvaliacoesDoCurso(int cursoId)
    {
        var avaliacoes = await _context.Avaliacoes
            .Where(a => a.CursoId == cursoId)
            .Select(a => new
            {
                a.Nota,
                a.Comentario,
                Usuario = a.User.UserName,
                a.DataAvaliacao
            })
            .ToListAsync();

        return Ok(avaliacoes);
    }
}

