document.addEventListener("DOMContentLoaded", function () {
    console.log('chatroom.js: DOMContentLoaded');
    const messageInput = document.getElementById("message_input");
    const sendButton = document.getElementById("send_button");
    const messageList = document.getElementById("message_list");
    const userList = document.getElementById("user_list");

    // current user: prefer stored name, fall back to 'User'
    const storedName = localStorage.getItem('name');
    let currentUser = storedName && storedName.length ? storedName : 'User';

    // render user panel (simple static users for now)
    function initUsers() {
        if (!userList) return;
        userList.innerHTML = '';
        const u1 = document.createElement('div'); u1.textContent = currentUser;
        const u2 = document.createElement('div'); u2.textContent = 'Guest';
        userList.appendChild(u1);
        userList.appendChild(u2);
    }

    // append a single message DOM node
    function appendMessage(msg) {
        if (!messageList) return;
        const li = document.createElement('li');
        li.style.marginBottom = '0.5rem';
        const userSpan = document.createElement('span');
        userSpan.textContent = (msg.user || 'Anonym') + ': ';
        userSpan.style.fontWeight = 'bold';
        userSpan.classList.add('chat-user');
        const textSpan = document.createElement('span');
        textSpan.textContent = msg.text;
        li.appendChild(userSpan);
        li.appendChild(textSpan);
        messageList.appendChild(li);
        messageList.scrollTop = messageList.scrollHeight;
        // update lastSeenId when we append a server-provided id
        if (msg && msg.id) {
            try {
                const idNum = Number(msg.id);
                if (!isNaN(idNum) && idNum > lastSeenId) lastSeenId = idNum;
            } catch (e) { /* ignore */ }
        }
    }

    // track last seen message id for incremental updates
    let lastSeenId = 0;

    // load existing messages from server (initial load)
    async function loadMessages() {
        try {
            const res = await fetch('/messages');
            if (!res.ok) return;
            const messages = await res.json();
            if (!Array.isArray(messages)) return;
            messageList.innerHTML = '';
            messages.forEach(m => appendMessage(m));
            if (messages.length) lastSeenId = messages[messages.length - 1].id || lastSeenId;
        } catch (err) {
            console.error('Failed to load messages', err);
        }
    }

    // poll for new messages and append only new ones
    async function pollMessages() {
        try {
            const res = await fetch('/messages');
            if (!res.ok) return;
            const messages = await res.json();
            if (!Array.isArray(messages) || messages.length === 0) return;
            // find index of lastSeenId
            let startIndex = 0;
            if (lastSeenId) {
                startIndex = messages.findIndex(m => m.id === lastSeenId) + 1;
                if (startIndex === 0) startIndex = 0; // not found -> append all
            }
            for (let i = startIndex; i < messages.length; i++) {
                appendMessage(messages[i]);
            }
            lastSeenId = messages[messages.length - 1].id || lastSeenId;
        } catch (err) {
            console.error('pollMessages failed', err);
        }
    }

    // send message to server and append on success
    async function sendMessage() {
        const text = messageInput && messageInput.value ? messageInput.value.trim() : '';
        if (!text) return;
        const payload = { user: currentUser, text };
        console.log('sendMessage: sending', payload);
        if (sendButton) sendButton.disabled = true;
        try {
            const res = await fetch('/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            console.log('sendMessage: response status', res.status);
            if (!res.ok) {
                const txt = await res.text();
                console.error('send failed', txt);
                alert('Fehler beim Senden der Nachricht');
                return;
            }
            const data = await res.json();
            if (data && data.success && data.message) {
                appendMessage(data.message);
                if (messageInput) messageInput.value = '';
            } else {
                console.error('unexpected response', data);
                alert('Fehler: Nachricht wurde nicht gespeichert');
            }
        } catch (err) {
            console.error('Failed to send message', err);
            alert('Netzwerkfehler beim Senden');
            // fallback: append locally so user sees their message
            appendMessage({ user: currentUser, text, ts: new Date().toISOString() });
            if (messageInput) messageInput.value = '';
        } finally {
            if (sendButton) sendButton.disabled = false;
        }
    }

    initUsers();
    loadMessages();

    // start polling for new messages every 2 seconds
    const POLL_INTERVAL_MS = 1000;
    setInterval(pollMessages, POLL_INTERVAL_MS);

    if (sendButton) sendButton.addEventListener('click', (e) => { e.preventDefault(); sendMessage(); });
    if (messageInput) messageInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') { event.preventDefault(); sendMessage(); }
    });

});