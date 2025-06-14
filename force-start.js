// Controleer of de app als geïnstalleerde app draait
const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

// Voer de logica alleen uit in de standalone modus
if (isStandalone) {
  // Controleer of er al een sessie is gestart
  // sessionStorage wordt gewist als de app volledig wordt afgesloten
  if (!sessionStorage.getItem('zisa_session_started')) {
    
    // Als er nog geen sessie is, markeer deze dan als gestart
    sessionStorage.setItem('zisa_session_started', 'true');

    // Als de app dan NIET op start.html is, stuur hem daarheen.
    // Dit gebeurt dus maar één keer per sessie.
    if (!window.location.pathname.endsWith("start.html")) {
      window.location.href = "start.html";
    }
  }
}
