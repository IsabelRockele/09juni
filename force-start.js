// Controleer of de app als geïnstalleerde app draait
const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

// Wacht tot alles geladen is voor redirectcontrole
window.addEventListener("load", () => {
  setTimeout(() => {
    if (isStandalone) {
      if (!sessionStorage.getItem('zisa_session_started')) {
        sessionStorage.setItem('zisa_session_started', 'true');

        if (!window.location.pathname.endsWith("start.html")) {
          window.location.href = "start.html";
        }
      }
    }
  }, 300); // korte vertraging geeft voldoende tijd voor eerste klik
});

