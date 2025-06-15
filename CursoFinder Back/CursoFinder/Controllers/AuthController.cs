using CursoFinder.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CursoFinder.DTOs;
using CursoFinder.Services;


namespace CursoFinder.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IConfiguration _configuration;

        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var user = new User { UserName = dto.UserName, Email = dto.Email };
            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            // Usuário comum por padrão
            await _userManager.AddToRoleAsync(user, "Usuario");

            return Ok("Usuário registrado com sucesso");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
                return Unauthorized("Email ou senha inválidos.");

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? "Usuario"; // Default se não tiver role

            var token = GenerateJwtToken(user, role);

            return Ok(new { token });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto model, [FromServices] EmailService emailService, [FromServices] IConfiguration config)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return BadRequest("Usuário não encontrado.");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            // Pega a URL do frontend do appsettings.json
            string frontendUrl = config["FrontendUrl"];

            // Agora a URL aponta para a interface React
            var resetLink = $"{frontendUrl}/reset-password?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(model.Email)}";

            string subject = "Recuperação de Senha - CursoFinder";
            string body = $"<p>Olá,</p><p>Para redefinir sua senha, clique no link abaixo:</p><p><a href='{resetLink}'>Redefinir Senha</a></p>";

            await emailService.SendEmailAsync(model.Email, subject, body);

            return Ok("E-mail enviado com sucesso.");
        }


        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return BadRequest("Usuário não encontrado.");
            }

            var result = await _userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok("Senha redefinida com sucesso.");
        }

        private string GenerateJwtToken(User user, string role)
        {
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);

            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id), // Id do usuário
        new Claim(ClaimTypes.Name, user.UserName),     // Nome do usuário
        new Claim(JwtRegisteredClaimNames.Sub, user.Email), // Email no sub (opcional, pode manter)
        new Claim(ClaimTypes.Role, role)               // Role do usuário
    };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(4),          // 4 horas de validade
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}

