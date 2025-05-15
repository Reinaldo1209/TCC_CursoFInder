using CursoFinder.Data;
using CursoFinder.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CursoFinder.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CursosSalvosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CursosSalvosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/CursosSalvos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Curso>>> GetCursosSalvos()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var cursosSalvos = await _context.CursosSalvos
                .Where(cs => cs.UserId == userId)
                .Include(cs => cs.Curso)
                .Select(cs => cs.Curso)
                .ToListAsync();

            return Ok(cursosSalvos);
        }

        // POST: api/CursosSalvos
        [HttpPost]
        public async Task<IActionResult> SalvarCurso([FromBody] int cursoId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var cursoExiste = await _context.Cursos.AnyAsync(c => c.Id == cursoId);
            if (!cursoExiste)
                return NotFound("Curso não encontrado.");

            var jaSalvo = await _context.CursosSalvos
                .AnyAsync(cs => cs.UserId == userId && cs.CursoId == cursoId);

            if (jaSalvo)
                return BadRequest("Curso já foi salvo.");

            var cursoSalvo = new CursoSalvo
            {
                UserId = userId,
                CursoId = cursoId
            };

            _context.CursosSalvos.Add(cursoSalvo);
            await _context.SaveChangesAsync();

            return Ok("Curso salvo com sucesso!");
        }

        // DELETE: api/CursosSalvos/5
        [HttpDelete("{cursoId}")]
        public async Task<IActionResult> RemoverCursoSalvo(int cursoId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var cursoSalvo = await _context.CursosSalvos
                .FirstOrDefaultAsync(cs => cs.UserId == userId && cs.CursoId == cursoId);

            if (cursoSalvo == null)
                return NotFound("Curso salvo não encontrado.");

            _context.CursosSalvos.Remove(cursoSalvo);
            await _context.SaveChangesAsync();

            return Ok("Curso removido dos salvos.");
        }
    }
}

