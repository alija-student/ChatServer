function updateUI() {
    const loggedIn = isLoggedIn();

    const chatBtn     = document.getElementById("chatBtn");
    const profileBtn  = document.getElementById("profileBtn");
    const loginBtn    = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");

    if (!loggedIn) {
        if (chatBtn)     chatBtn.disabled     = true;
        if (profileBtn)  profileBtn.disabled  = true;
        if (loginBtn)    loginBtn.disabled    = false;
        if (registerBtn) registerBtn.disabled = false;
    } else {
        if (chatBtn)     chatBtn.disabled     = false;
        if (profileBtn)  profileBtn.disabled  = false;
        if (loginBtn)    loginBtn.disabled    = true;
        if (registerBtn) registerBtn.disabled = true;
    }
}

updateUI();
