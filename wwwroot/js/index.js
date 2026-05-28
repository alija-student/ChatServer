function updateUI() {
    const loggedIn = isLoggedIn();

    const show = (id) => { const el = document.getElementById(id); if (el) el.style.display = ""; };
    const hide = (id) => { const el = document.getElementById(id); if (el) el.style.display = "none"; };

    if (loggedIn) {
        show("chatBtn");
        show("profileBtn");
        show("logoutBtn");
        hide("loginBtn");
        hide("registerBtn");
    } else {
        hide("chatBtn");
        hide("profileBtn");
        hide("logoutBtn");
        show("loginBtn");
        show("registerBtn");
    }
}

updateUI();
