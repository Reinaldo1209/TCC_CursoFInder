using CursoFinder.Data;
using CursoFinder.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CursoFinder.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CursoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CursoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Curso
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Curso>>> GetCursosPublicos()
        {
            var cursos = await _context.Cursos.ToListAsync();
            return Ok(cursos);
        }

        // GET: api/Curso/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Curso>> GetCursoById(int id)
        {
            var curso = await _context.Cursos.FindAsync(id);

            if (curso == null)
                return NotFound();

            return Ok(curso);
        }

        // POST: api/Curso
        [HttpPost]
        [Authorize] // Apenas usuários autenticados podem cadastrar novos cursos
        public async Task<ActionResult<Curso>> PostCurso(Curso curso)
        {
            _context.Cursos.Add(curso);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCursoById), new { id = curso.Id }, curso);
        }

        // PUT: api/Curso/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutCurso(int id, Curso curso)
        {
            if (id != curso.Id)
                return BadRequest();

            var cursoExistente = await _context.Cursos.FindAsync(id);
            if (cursoExistente == null)
                return NotFound();

            // Atualiza os campos permitidos
            cursoExistente.Titulo = curso.Titulo;
            cursoExistente.Descricao = curso.Descricao;
            cursoExistente.Instituicao = curso.Instituicao;
            cursoExistente.CargaHoraria = curso.CargaHoraria;
            cursoExistente.Valor = curso.Valor;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Curso/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteCurso(int id)
        {
            var curso = await _context.Cursos.FindAsync(id);
            if (curso == null)
                return NotFound();

            _context.Cursos.Remove(curso);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}


