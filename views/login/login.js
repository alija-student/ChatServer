// views/login/login.js
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('loginBtn');
  const identifierEl = document.getElementById('identifier'); // E-Mail oder Benutzername
  const passwordEl = document.getElementById('password');
  const msg = document.getElementById('msg'); // optionales Meldungsfeld

  if (!btn) return;

  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    msg && (msg.textContent = '');

    const identifier = (identifierEl?.value || '').trim();
    const password = passwordEl?.value || '';

    if (!identifier || !password) {
      if (msg) msg.textContent = 'Bitte E-Mail/Benutzername und Passwort eingeben.';
      window.parent.postMessage({ action: 'loginFailed', message: 'Fehlende Eingaben' }, '*');
      return;
    }

    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      const data = await res.json().catch(() => ({ success: false, message: 'Ungültige Server-Antwort' }));

      if (res.ok && data.success) {
        // optional: sichere User-Daten speichern
        if (data.user) sessionStorage.setItem('user', JSON.stringify(data.user));
        window.parent.postMessage({ action: 'loginSuccess', user: data.user || null }, '*');
      } else {
        if (msg) msg.textContent = data.message || 'Login fehlgeschlagen.';
        window.parent.postMessage({ action: 'loginFailed', message: data.message || 'Login fehlgeschlagen.' }, '*');
      }
    } catch (err) {
      console.error(err);
      if (msg) msg.textContent = 'Netzwerkfehler.';
      window.parent.postMessage({ action: 'loginFailed', message: 'Netzwerkfehler' }, '*');
    }
  });
});
