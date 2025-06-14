document.addEventListener("DOMContentLoaded", () => {
  const keuzeKnoppen = document.querySelectorAll(".keuze");
  const startKnop = document.getElementById("startSpel");
  const melding = document.getElementById("meldingSplitsing");

  let gekozenMax = null;

  keuzeKnoppen.forEach(knop => {
    knop.addEventListener("click", () => {
      keuzeKnoppen.forEach(k => k.classList.remove("active"));
      knop.classList.add("active");
      gekozenMax = knop.dataset.max;

      startKnop.disabled = false;
      startKnop.textContent = "Start spel";
      startKnop.style.cursor = "pointer";
      melding.style.display = "none";
    });
  });

  startKnop.addEventListener("click", () => {
    if (!gekozenMax) {
      melding.style.display = "block";
      return;
    }
    window.location.href = `splits_bingo.html?max=${gekozenMax}`;
  });
});
