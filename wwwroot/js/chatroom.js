requireLogin();

function formatTime(ts) {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function loadUsers() {
    const res = await fetch(`${API_URL}/users`);
    const users = await res.json();
    const currentUser = getUser();

    users.sort((a, b) => {
        const aOnline = a.username === currentUser ? 0 : 1;
        const bOnline = b.username === currentUser ? 0 : 1;
        if (aOnline !== bOnline) return aOnline - bOnline;
        return a.username.localeCompare(b.username);
    });

    const list = document.getElementById("userList");
    list.innerHTML = "";

    users.forEach(u => {
        const li = document.createElement("li");
        li.textContent = u.username;
        if (u.username === currentUser) li.classList.add("online");
        list.appendChild(li);
    });
}

async function loadMessages() {
    const res = await fetch(`${API_URL}/messages`);
    const messages = await res.json();
    const currentUser = getUser();

    const chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = "";

    messages.forEach(m => {
        const isOwn = m.user === currentUser;

        const wrapper = document.createElement("div");
        wrapper.className = `message-wrapper ${isOwn ? "own" : "other"}`;

        const bubble = document.createElement("div");
        bubble.className = `bubble ${isOwn ? "own" : "other"}`;

        if (!isOwn) {
            const sender = document.createElement("div");
            sender.className = "bubble-sender";
            sender.textContent = m.user;
            bubble.appendChild(sender);
        }

        const text = document.createElement("div");
        text.className = "bubble-text";
        text.textContent = m.text;
        bubble.appendChild(text);

        const time = document.createElement("div");
        time.className = "bubble-time";
        time.textContent = formatTime(m.ts);
        bubble.appendChild(time);

        wrapper.appendChild(bubble);
        chatBox.appendChild(wrapper);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById("messageInput");
    const text = input.value.trim();

    if (!text) return;

    await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: getUser(), text })
    });

    input.value = "";
    loadMessages();
}

document.getElementById("messageInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});

loadUsers();
loadMessages();
setInterval(loadMessages, 3000);
