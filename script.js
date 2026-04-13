const toggleCheckbox = document.getElementById('toggle-theme');
const themeStyle = document.getElementById('theme-style');
const viewContainer = document.getElementById("view_container");

toggleCheckbox.addEventListener('change', () => {
    if (toggleCheckbox.checked) {
        themeStyle.setAttribute('href', 'dark-mode.css');
    } else {
        themeStyle.setAttribute('href', 'style.css');
    }

    // Optional: Update iframe content
    const iframeDocument = viewContainer.contentDocument || viewContainer.contentWindow.document;
    if (iframeDocument) {
        const body = iframeDocument.body;
        body.className = toggleCheckbox.checked ? 'dark-mode' : '';
    }
});

window.successful_loggedin = false;

const views = {
    chatroom: { id: "chatroom", src: "./views/chatroom/chatroom.html" },
    calendar: { id: "calendar", src: "./views/calendar/calendar.html" },
    login: { id: "login", src: "./views/login/login.html" },
    page_not_found: { id: "", src: "./views/error_pages/page_not_found.html" }
};

var activeBtn = null;

function init(){
    // If previously logged in, don't require a second login — load chatroom directly
    if (localStorage.getItem('loggedin') === 'true') {
        set_var_successful_loggedin(true);
        switchView('chatroom');
        return;
    }

    // Otherwise show the login view inside the container
    viewContainer.src = views.login.src;
}

window.addEventListener("message", (event) => {
    if (event.data.action === "loginSuccess") {
        set_var_successful_loggedin(true);
        switchView("chatroom");
    }
});

function set_var_successful_loggedin(value) {
    window.successful_loggedin = value;
}

function get_var_successful_loggedin() {
    return window.successful_loggedin;
}

function switchView(id) {
    if (!get_var_successful_loggedin()) return;

    if (activeBtn != null) {
        activeBtn.classList.remove("active");
    }
    switch (id) {
        case views.chatroom.id:
            viewContainer.src = views.chatroom.src;
            activeBtn = document.getElementById("btn_chatroom");
            activeBtn.classList.add("active");
            break;
        case views.calendar.id:
            viewContainer.src = views.calendar.src;
            activeBtn = document.getElementById("btn_calendar");
            activeBtn.classList.add("active");
            break;
        default:
            viewContainer.src = views.page_not_found.src;
            activeBtn = null;
            break;
    }
}

init();