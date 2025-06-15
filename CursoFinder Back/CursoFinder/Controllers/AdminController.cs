using CursoFinder.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly UserManager<User> _userManager;

    public AdminController(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    [HttpPost("promover")]
    public async Task<IActionResult> PromoverUsuario([FromQuery] string email, [FromQuery] string novaRole)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
            return NotFound("Usuário não encontrado.");

        var rolesAtuais = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, rolesAtuais); // Remove todas

        if (!await _userManager.IsInRoleAsync(user, novaRole))
            await _userManager.AddToRoleAsync(user, novaRole);

        return Ok($"Usuário promovido para a role: {novaRole}");
    }
}
