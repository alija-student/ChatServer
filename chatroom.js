requireLogin();

async function loadUsers() {
    const res = await fetch(`${API_URL}/users`);
    const users = await res.json();

    const list = document.getElementById("userList");
    list.innerHTML = "";

    users.forEach(u => {
        const li = document.createElement("li");
        li.textContent = u.username;
        list.appendChild(li);
    });
}

async function loadMessages() {
    const res = await fetch(`${API_URL}/messages`);
    const messages = await res.json();

    const chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = "";

    messages.forEach(m => {
        const div = document.createElement("div");
        div.textContent = `${m.user}: ${m.text}`;
        chatBox.appendChild(div);
    });
}

async function sendMessage() {
    const input = document.getElementById("messageInput");
    const text = input.value;

    if (!text) return;

    await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user: getUser(),
            text: text
        })
    });

    input.value = "";
    loadMessages();
}

// initial load
loadUsers();
loadMessages();