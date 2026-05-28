using ChatServer.Data;
using ChatServer.Models;
using Microsoft.AspNetCore.Mvc;

namespace ChatServer.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;

    public AuthController(AppDbContext db) => _db = db;

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest req)
    {
        var user = _db.Users.FirstOrDefault(u =>
            (u.Username == req.Username || u.Email == req.Username) &&
            u.Password == req.Password);

        if (user == null)
            return Ok(new { success = false });

        return Ok(new { success = true, name = user.Name, username = user.Username });
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Username) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest(new { success = false, error = "missing_fields" });

        if (_db.Users.Any(u => u.Username == req.Username))
            return Ok(new { success = false, error = "user_exists" });

        _db.Users.Add(new User
        {
            Username = req.Username,
            Password = req.Password,
            Name = req.Name ?? req.Username,
            Email = req.Email ?? ""
        });
        _db.SaveChanges();

        return Ok(new { success = true });
    }
}

public record LoginRequest(string Username, string Password);
public record RegisterRequest(string Username, string Password, string? Name, string? Email);
