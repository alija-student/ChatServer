function showError(msg) {
    const el = document.getElementById("errorMsg");
    el.textContent = msg;
    el.style.color = "#ef4444";
    el.style.display = "block";
}

async function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
        showError("Bitte alle Felder ausfüllen.");
        return;
    }

    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!data.success) {
        showError("Falscher Benutzername oder Passwort.");
        return;
    }

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("username", data.username);

    window.location.href = "index.html";
}

document.getElementById("loginBtn").addEventListener("click", login);

["username", "password"].forEach(id => {
    document.getElementById(id).addEventListener("keydown", e => {
        if (e.key === "Enter") login();
    });
});
