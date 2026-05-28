using ChatServer.Data;
using ChatServer.Models;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace ChatServer.Hubs;

public class ChatHub : Hub
{
    // Tracks connectionId -> username for all active connections
    private static readonly ConcurrentDictionary<string, string> _connections = new();

    private readonly AppDbContext _db;

    public ChatHub(AppDbContext db) => _db = db;

    public async Task Join(string username)
    {
        _connections[Context.ConnectionId] = username;
        await BroadcastUsers();
    }

    public async Task SendMessage(string text)
    {
        if (!_connections.TryGetValue(Context.ConnectionId, out var username)) return;

        var trimmed = text.Trim();
        if (string.IsNullOrEmpty(trimmed)) return;
        if (trimmed.Length > 500) return;

        var msg = new Message { User = username, Text = trimmed, Ts = DateTime.UtcNow };
        _db.Messages.Add(msg);
        await _db.SaveChangesAsync();

        await Clients.All.SendAsync("ReceiveMessage", new
        {
            id = msg.Id,
            user = msg.User,
            text = msg.Text,
            ts = msg.Ts
        });
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _connections.TryRemove(Context.ConnectionId, out _);
        await BroadcastUsers();
        await base.OnDisconnectedAsync(exception);
    }

    private async Task BroadcastUsers()
    {
        var allUsers = _db.Users.Select(u => u.Username).ToList();
        var onlineSet = _connections.Values.ToHashSet(StringComparer.OrdinalIgnoreCase);

        var list = allUsers
            .Select(u => new { username = u, online = onlineSet.Contains(u) })
            .OrderByDescending(u => u.online)
            .ThenBy(u => u.username)
            .ToList();

        await Clients.All.SendAsync("UpdateUsers", list);
    }
}
