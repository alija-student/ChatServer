/*
document.getElementById('loginBtn').addEventListener('click', function () {
  // hier könntest du Username/Passwort prüfen
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  if (user === "admin" && pass === "1234") {
    // Nachricht an die Index-Seite schicken
    window.parent.postMessage({ action: "loginSuccess" }, "*");
  } else {
    alert("Login fehlgeschlagen!");
  }
});
*/
async function login()
{
  const userEl = document.getElementById("username");
  const passEl = document.getElementById("password");

  if (!userEl || !passEl) {
    const resultEl = document.getElementById('result');
    if (resultEl) resultEl.innerText = 'Fehler: Eingabefelder nicht gefunden';
    return;
  }

  const username = userEl.value;
  const password = passEl.value;

  const res = await fetch("/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({username: username, password: password})
  });

  const data = await res.json();

  if (data.success)
  {
    // mark logged in and navigate to the chatroom page
    localStorage.setItem('loggedin', 'true');
    localStorage.setItem('name', data.name || '');
    window.location.href = '/chatroom.html';
  }
  else
  {
    // show generic error in the result element if present (do not reveal which field is wrong)
    const resultEl = document.getElementById('result');
    const msg = 'Benutzername oder Passwort falsch';
    if (resultEl) resultEl.innerText = msg;
    else alert(msg);
  }
}

// Ensure the function is available for inline onclick handlers
window.login = login;

// Attach click handler to the login button if present (supports non-inline usage)
const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
  loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    login();
  });
}