using ChatServer.Data;
using ChatServer.Hubs;
using ChatServer.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Ensure database exists and seed initial data
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    if (!db.Users.Any())
    {
        db.Users.Add(new User { Username = "alija.b", Password = "Test123", Name = "Alija", Email = "" });
        db.SaveChanges();
    }

    if (!db.Messages.Any())
    {
        db.Messages.AddRange(
            new Message { User = "Alija", Text = "hallo",   Ts = new DateTime(2026, 4, 13, 23, 32, 16, DateTimeKind.Utc) },
            new Message { User = "Alija", Text = "wassup",  Ts = new DateTime(2026, 4, 13, 23, 32, 24, DateTimeKind.Utc) },
            new Message { User = "Alija", Text = "hello",   Ts = new DateTime(2026, 4, 13, 23, 33,  1, DateTimeKind.Utc) },
            new Message { User = "Alija", Text = "na du",   Ts = new DateTime(2026, 4, 13, 23, 33,  7, DateTimeKind.Utc) },
            new Message { User = "Alija", Text = "hi",      Ts = new DateTime(2026, 4, 13, 23, 36, 49, DateTimeKind.Utc) },
            new Message { User = "Alija", Text = "wassup",  Ts = new DateTime(2026, 4, 13, 23, 37,  5, DateTimeKind.Utc) },
            new Message { User = "Alija", Text = "yooooooooo", Ts = new DateTime(2026, 4, 13, 23, 40, 5, DateTimeKind.Utc) }
        );
        db.SaveChanges();
    }
}

app.UseDefaultFiles();   // serves index.html for /
app.UseStaticFiles();    // serves wwwroot/
app.MapControllers();
app.MapHub<ChatHub>("/hubs/chat");

app.Run();
