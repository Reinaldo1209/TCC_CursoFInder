using CursoFinder.Data;
using CursoFinder.DTOs;
using CursoFinder.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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

        [Authorize(Roles = "AdminFaculdade,AdminGeral")]
        [HttpGet("admin")]
        public async Task<ActionResult<IEnumerable<Curso>>> GetCursosDoAdmin()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var cursos = await _context.Cursos
                .Where(c => c.UserId == userId)
                .ToListAsync();

            return Ok(cursos);
        }

        [Authorize(Roles = "AdminFaculdade,AdminGeral")]
        [HttpPost]
        public async Task<IActionResult> CriarCurso([FromBody] CursoCreateDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var curso = new Curso
            {
                Titulo = dto.Titulo,
                Tipo = dto.Tipo,
                Localização = dto.Localização,
                Descricao = dto.Descricao,
                Instituicao = dto.Instituicao,
                CargaHoraria = dto.CargaHoraria,
                Link = dto.Link,
                Valor = dto.Valor,
                UserId = userId
            };

            _context.Cursos.Add(curso);
            await _context.SaveChangesAsync();

            return Ok(curso);
        }


        // PUT: api/Curso/5
        [HttpPut("{id}")]
        [Authorize(Roles = "AdminFaculdade,AdminGeral")]
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
            cursoExistente.Localização = curso.Localização;
            cursoExistente.Link = curso.Link;
            cursoExistente.Valor = curso.Valor;
            cursoExistente.Link = curso.Link;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Curso/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "AdminFaculdade,AdminGeral")]
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


