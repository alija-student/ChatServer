async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/users`);
    const users = await res.json();

    const user = users.find(u =>
        u.username === username &&
        u.password === password
    );

    if (!user) {
        alert("No such account, you have to register");
        return;
    }

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("username", username);

    window.location.href = "index.html";
}