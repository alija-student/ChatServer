requireLogin();

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/chat")
    .withAutomaticReconnect()
    .build();

function formatTime(ts) {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function appendMessage(m) {
    const chatBox = document.getElementById("chatBox");
    const currentUser = getUser();
    const isOwn = m.user === currentUser;

    // Check if the last bubble is from the same user → extend the group
    const lastWrapper = chatBox.lastElementChild;
    const sameUser = lastWrapper && lastWrapper.dataset.user === m.user;

    if (sameUser) {
        // Upgrade previous bubble: single→first, last→middle
        const prevPos = lastWrapper.dataset.pos;
        const newPrevPos = prevPos === "single" ? "first" : "middle";
        lastWrapper.dataset.pos = newPrevPos;

        const prevBubble = lastWrapper.querySelector(".bubble");
        prevBubble.classList.remove("pos-single", "pos-last");
        prevBubble.classList.add(`pos-${newPrevPos}`);

        // Hide the timestamp of the now-non-final bubble
        lastWrapper.querySelector(".bubble-time").style.display = "none";

        // Tighten the gap between grouped bubbles
        lastWrapper.style.marginBottom = "3px";
    }

    const pos = sameUser ? "last" : "single";

    const wrapper = document.createElement("div");
    wrapper.className = `message-wrapper ${isOwn ? "own" : "other"}`;
    wrapper.dataset.user = m.user;
    wrapper.dataset.pos = pos;
    wrapper.style.marginBottom = "14px";

    const bubble = document.createElement("div");
    bubble.className = `bubble ${isOwn ? "own" : "other"} pos-${pos}`;

    // Sender name: only for other users, only on the first bubble of a group
    if (!isOwn && (pos === "single" || pos === "first")) {
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
    chatBox.scrollTop = chatBox.scrollHeight;
}

function renderUsers(users) {
    const list = document.getElementById("userList");
    list.innerHTML = "";

    users.forEach(u => {
        const li = document.createElement("li");
        li.textContent = u.username;
        if (u.online) li.classList.add("online");
        list.appendChild(li);
    });
}

async function sendMessage() {
    const input = document.getElementById("messageInput");
    const text = input.value.trim();
    if (!text) return;
    if (text.length > 500) {
        alert("Message too long (max 500 characters).");
        return;
    }
    await connection.invoke("SendMessage", text);
    input.value = "";
}

document.getElementById("messageInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});

connection.on("ReceiveMessage", appendMessage);
connection.on("UpdateUsers", renderUsers);

async function start() {
    await connection.start();
    await connection.invoke("Join", getUser());

    // Load message history
    const res = await fetch(`${API_URL}/messages`);
    const messages = await res.json();
    messages.forEach(appendMessage);
}

start();
