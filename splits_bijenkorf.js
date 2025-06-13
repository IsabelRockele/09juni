// splits_bijenkorf.js

let maxGetal = 5;
let scoreJuist = 0;
let scoreFout = 0;
let oefeningen = [];
let huidigeOefening = 0;

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  maxGetal = parseInt(params.get("max")) || 5;

  document.getElementById("btn-terug").addEventListener("click", () => {
    window.location.href = "splitsen_bibi.html";
  });

  document.getElementById("btn-opnieuw").addEventListener("click", () => {
    window.location.reload();
  });

  genereerOefeningen();
  toonVolgendeOefening();
});

function genereerOefeningen() {
  oefeningen = [];
  for (let i = 0; i < 20; i++) {
    const getal = Math.floor(Math.random() * maxGetal) + 1;
    const deel1 = Math.floor(Math.random() * (getal + 1));
    const deel2 = getal - deel1;
    const vraagLinks = Math.random() < 0.5;

    oefeningen.push({
      totaal: getal,
      bekend: vraagLinks ? deel2 : deel1,
      onbekend: vraagLinks ? deel1 : deel2,
      vraagLinks: vraagLinks
    });
  }
}

function toonVolgendeOefening() {
  if (huidigeOefening >= oefeningen.length) return toonFeedback();

  const oef = oefeningen[huidigeOefening];
  const splitsingEl = document.getElementById("splitsing");
  splitsingEl.innerHTML = `
  <div class="splitsboom">
    <div class="bovengetal">${oef.totaal}</div>
    <div class="lijnen">
      <div class="lijn lijn-links"></div>
      <div class="lijn lijn-rechts"></div>
    </div>
    <div class="benen">
      <div class="been">${oef.vraagLinks ? "?" : oef.bekend}</div>
      <div class="been">${oef.vraagLinks ? oef.bekend : "?"}</div>
    </div>
  </div>`;

  toonBijen(oef.onbekend);
}

function toonBijen(juisteAntwoord) {
  const container = document.getElementById("bijenrij");
  container.innerHTML = "";
  let antwoorden = [juisteAntwoord];

  // Voeg een klassieke fout toe: totaal + bekend deel
  const oef = oefeningen[huidigeOefening];
  const foutOptelling = oef.totaal + oef.bekend;
  if (
  foutOptelling !== juisteAntwoord &&
  !antwoorden.includes(foutOptelling)
  ) {
    antwoorden.push(foutOptelling);
  }

  // Voeg tot er 4 unieke antwoorden zijn
  while (antwoorden.length < 4) {
    const willekeurig = Math.floor(Math.random() * (maxGetal + 1));
    if (!antwoorden.includes(willekeurig)) antwoorden.push(willekeurig);
  }

  // Door elkaar schudden
  antwoorden.sort(() => 0.5 - Math.random());

  // Maak de bijtjes
  antwoorden.forEach(antwoord => {
    const bij = document.createElement("div");
    bij.className = "bij";
    bij.innerHTML = `
      <img src="leerjaar1_afbeeldingen/bijtje.png" alt="bij" />
      <span class="getal">${antwoord}</span>
    `;
    bij.addEventListener("click", () => controleerAntwoord(bij, antwoord === juisteAntwoord));
    container.appendChild(bij);
  });
}

function controleerAntwoord(bijElement, juist) {
  const container = document.getElementById("bijenrij");
  container.querySelectorAll(".bij").forEach(b => b.style.pointerEvents = "none");

  if (juist) {
    bijElement.classList.add("vlieg-naar-korf");
    scoreJuist++;
    document.getElementById("scoreJuist").textContent = scoreJuist;
    setTimeout(() => {
  huidigeOefening++;
  if (huidigeOefening >= oefeningen.length) {
    toonFeedback();
  } else {
    toonVolgendeOefening();
  }
}, 1000); // gebruik 1300 bij fouten
  } else {
    bijElement.classList.add("fout");
    scoreFout++;
    document.getElementById("scoreFout").textContent = scoreFout;
    setTimeout(() => {
      huidigeOefening++;
      toonVolgendeOefening();
    }, 1300);
  }
}

function toonFeedback() {
  const feedbackContainer = document.getElementById("feedbackContainer");
  const feedbackText = document.getElementById("feedbackText");
  const splitsContainer = document.querySelector(".splits-container");
  const bijenContainer = document.getElementById("bijenrij");

  // Verberg oefening
  splitsContainer.style.display = "none";
  bijenContainer.style.display = "none";

  // Toon feedback
  feedbackContainer.style.display = "block";

  if (scoreFout === 0) {
    feedbackText.textContent = "Dikke proficiat!";
    document.getElementById("feedbackAfbeelding").src = "leerjaar1_afbeeldingen/juichende_bibi.png";
  } else {
    feedbackText.textContent = "Probeer nog eens tot je het zonder fouten kan.";
    document.getElementById("feedbackAfbeelding").src = "tafels_afbeeldingen/juf_zisa.png";
  }
}
