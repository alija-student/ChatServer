namespace ChatServer.Models;

public class Message
{
    public int Id { get; set; }
    public string User { get; set; } = "";
    public string Text { get; set; } = "";
    public DateTime Ts { get; set; }
}
