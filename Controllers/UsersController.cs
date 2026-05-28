using ChatServer.Data;
using Microsoft.AspNetCore.Mvc;

namespace ChatServer.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;

    public UsersController(AppDbContext db) => _db = db;

    [HttpGet]
    public IActionResult GetUsers()
    {
        var users = _db.Users
            .Select(u => new { u.Username, u.Name })
            .ToList();
        return Ok(users);
    }
}
