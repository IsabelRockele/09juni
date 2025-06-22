// JS voor tafel_oefenen.html – keuzescherm

document.addEventListener("DOMContentLoaded", function () {
  let gekozenType = null;
  let gekozenTafels = [];
  let gekozenLevel = null;

  const typeKnoppen = document.querySelectorAll(".keuze");
  const tafelKnoppen = document.querySelectorAll(".tafel");
  const levelKnoppen = document.querySelectorAll(".level");
  const startKnop = document.getElementById("startOefening");
  const terugKnop = document.getElementById("btn-terug");

  const meldingType = document.getElementById("meldingType");
  const meldingTafels = document.getElementById("meldingTafels");
  const meldingLevel = document.getElementById("meldingLevel");
  
  // AANGEPAST: De terugknop verwijst nu altijd naar tafels_overzicht.html
  terugKnop.addEventListener('click', () => {
    window.location.href = 'tafel_overzicht.html'; // Hardcoded naar de gewenste pagina
  });
  // Einde aanpassing terugknop

  function checkKeuzes() {
    const allesGekozen = gekozenType && gekozenTafels.length > 0 && gekozenLevel;
    startKnop.disabled = !allesGekozen;
    startKnop.textContent = allesGekozen ? "Start oefening" : "Maak eerst je keuzes";
    startKnop.classList.toggle("actief", allesGekozen);
    startKnop.style.cursor = allesGekozen ? "pointer" : "not-allowed";

    meldingType.textContent = gekozenType ? "" : "Nog niet gekozen";
    meldingTafels.textContent = gekozenTafels.length > 0 ? "" : "Nog niet gekozen";
    meldingLevel.textContent = gekozenLevel ? "" : "Nog niet gekozen";
  }

  typeKnoppen.forEach(knop => {
    knop.addEventListener("click", function () {
      typeKnoppen.forEach(k => k.classList.remove("active"));
      this.classList.add("active");
      gekozenType = this.dataset.type;
      checkKeuzes();
    });
  });

  tafelKnoppen.forEach(knop => {
    knop.addEventListener("click", function () {
      const tafel = parseInt(this.dataset.tafel);
      this.classList.toggle("active");
      if (gekozenTafels.includes(tafel)) {
        gekozenTafels = gekozenTafels.filter(t => t !== tafel);
      } else {
        gekozenTafels.push(tafel);
      }
      checkKeuzes();
    });
  });

  levelKnoppen.forEach(knop => {
    knop.addEventListener("click", function () {
      levelKnoppen.forEach(k => k.classList.remove("active"));
      this.classList.add("active");
      gekozenLevel = parseInt(this.dataset.level);
      checkKeuzes();
    });
  });

  startKnop.addEventListener("click", function () {
    if (!gekozenType || gekozenTafels.length === 0 || !gekozenLevel) return;

    sessionStorage.setItem("tafel_type", gekozenType);
    sessionStorage.setItem("tafels", JSON.stringify(gekozenTafels));
    sessionStorage.setItem("tafel_level", gekozenLevel);

    if (gekozenLevel === 1) {
      window.location.href = "level1.html";
    } else if (gekozenLevel === 2) {
      window.location.href = "level2.html";
    } else if (gekozenLevel === 3) {
      window.location.href = "level3.html";
    }
  });

  checkKeuzes();
});