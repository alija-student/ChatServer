using ChatServer.Data;
using ChatServer.Models;
using Microsoft.AspNetCore.Mvc;

namespace ChatServer.Controllers;

[ApiController]
[Route("api/messages")]
public class MessagesController : ControllerBase
{
    private readonly AppDbContext _db;

    public MessagesController(AppDbContext db) => _db = db;

    [HttpGet]
    public IActionResult GetMessages()
    {
        var messages = _db.Messages.OrderBy(m => m.Ts).ToList();
        return Ok(messages);
    }

    [HttpPost]
    public IActionResult PostMessage([FromBody] SendMessageRequest req)
    {
        var text = req.Text?.Trim();
        if (string.IsNullOrEmpty(text))
            return BadRequest(new { success = false, error = "empty_message" });

        var msg = new Message
        {
            User = req.User ?? "Anonym",
            Text = text,
            Ts = DateTime.UtcNow
        };

        _db.Messages.Add(msg);
        _db.SaveChanges();

        return Ok(new { success = true, message = msg });
    }
}

public record SendMessageRequest(string? User, string? Text);
