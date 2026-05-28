function showMessage(msg, isError = true) {
    const el = document.getElementById("errorMsg");
    el.textContent = msg;
    el.style.color = isError ? "#ef4444" : "#16a34a";
    el.style.display = "block";
}

function validate(name, email, username, password) {
    if (!name || !email || !username || !password) {
        showMessage("Bitte alle Felder ausfüllen.");
        return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showMessage("Bitte eine gültige E-Mail-Adresse eingeben.");
        return false;
    }
    if (username.length < 3) {
        showMessage("Benutzername muss mindestens 3 Zeichen lang sein.");
        return false;
    }
    if (!/^[a-zA-Z0-9._]+$/.test(username)) {
        showMessage("Benutzername darf nur Buchstaben, Zahlen, Punkte und _ enthalten.");
        return false;
    }
    if (password.length < 6) {
        showMessage("Passwort muss mindestens 6 Zeichen lang sein.");
        return false;
    }
    return true;
}

async function register() {
    const name     = document.getElementById("name").value.trim();
    const email    = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!validate(name, email, username, password)) return;

    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, name, email })
    });

    const data = await res.json();

    if (!data.success) {
        showMessage(data.error === "user_exists"
            ? "Dieser Benutzername ist bereits vergeben."
            : "Registrierung fehlgeschlagen.");
        return;
    }

    showMessage("Account erstellt! Du wirst weitergeleitet...", false);
    setTimeout(() => { window.location.href = "login.html"; }, 1200);
}

document.getElementById("registerBtn").addEventListener("click", register);

["name", "email", "username", "password"].forEach(id => {
    document.getElementById(id).addEventListener("keydown", e => {
        if (e.key === "Enter") register();
    });
});
