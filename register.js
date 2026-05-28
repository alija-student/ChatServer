async function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/users`);
    const users = await res.json();

    const exists = users.find(u => u.username === username);

    if (exists) {
        alert("User already exists");
        return;
    }

    await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    alert("Account created, you can login now");
    window.location.href = "login.html";
}