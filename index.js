function updateUI() {
    const loggedIn = isLoggedIn();

    const chatBtn = document.getElementById("chatBtn");
    const profileBtn = document.getElementById("profileBtn");
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");

    if (!loggedIn) {
        chatBtn.disabled = true;
        profileBtn.disabled = true;

        loginBtn.disabled = false;
        registerBtn.disabled = false;
    } else {
        chatBtn.disabled = false;
        profileBtn.disabled = false;

        loginBtn.disabled = true;
        registerBtn.disabled = true;
    }
}

function goChat() {
    if (!isLoggedIn()) {
        alert("You have to login first");
        return;
    }
    window.location.href = "chat.html";
}

updateUI();