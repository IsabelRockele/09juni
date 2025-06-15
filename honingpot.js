// honingpot.js
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elementen ---
    const selectionScreen = document.getElementById('selection-screen');
    const gameContainer = document.getElementById('game-container-spel');
    const levelButtons = document.querySelectorAll('#level-options .keuze');
    const startSpelKnop = document.getElementById('start-spel-knop');
    const gameArea = document.getElementById('game-area');
    const playerContainer = document.getElementById('player-container'); // Aangepast naar container
    const player = document.getElementById('player');
    const speechBubble = document.getElementById('speech-bubble'); // Nieuw: spreekballon
    const scoreJuistEl = document.getElementById('scoreJuist');
    const scoreFoutEl = document.getElementById('scoreFout');
    const splitsingContainer = document.getElementById('splitsing-container');
    const btnOpnieuw = document.getElementById('btn-opnieuw');
    const btnTerug = document.getElementById('btn-terug');
    const btnLinks = document.getElementById('btn-links');
    const btnRechts = document.getElementById('btn-rechts');
    const eindFeedback = document.getElementById('eind-feedback');
    const feedbackAfbeelding = document.getElementById('feedback-afbeelding');
    const feedbackTekst = document.getElementById('feedback-tekst');
    const eindOpnieuwBtn = document.getElementById('eind-opnieuw');
    const eindTerugBtn = document.getElementById('eind-terug');

    // --- Spel Variabelen ---
    let targetNumber = null;
    let scoreJuist = 0;
    let scoreFout = 0;
    let oefeningTeller = 0;
    const TOTAAL_OEFENINGEN = 25;
    let currentSplitsing = {};
    let gameActive = false;
    const playerSpeed = 15;
    const keys = { ArrowLeft: false, ArrowRight: false };

    // --- Keuzemenu Logica ---
    levelButtons.forEach(knop => {
        knop.addEventListener('click', () => {
            levelButtons.forEach(k => k.classList.remove('active'));
            knop.classList.add('active');
            targetNumber = parseInt(knop.dataset.level);
            startSpelKnop.disabled = false;
            startSpelKnop.textContent = "Start het Spel!";
        });
    });

    startSpelKnop.addEventListener('click', () => {
        if (targetNumber) {
            selectionScreen.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            setTimeout(startGame, 0);
        }
    });

    // --- Spel Actie Knoppen ---
    btnOpnieuw.addEventListener('click', startGame);
    btnTerug.addEventListener('click', goBackToMenu);
    eindOpnieuwBtn.addEventListener('click', startGame);
    eindTerugBtn.addEventListener('click', goBackToMenu);

    function goBackToMenu() {
        endGame();
        gameContainer.classList.add('hidden');
        eindFeedback.classList.add('hidden');
        selectionScreen.classList.remove('hidden');
        
        targetNumber = null;
        levelButtons.forEach(k => k.classList.remove('active'));
        startSpelKnop.disabled = true;
        startSpelKnop.textContent = 'Kies eerst een splitsing';
    }

    // --- Spel Functies ---
    function startGame() {
        endGame();
        eindFeedback.classList.add('hidden');
        gameContainer.classList.remove('hidden');

        scoreJuist = 0;
        scoreFout = 0;
        oefeningTeller = 0;
        updateScore();
        
        gameActive = true;
        toonVolgendeOefening();
        requestAnimationFrame(gameLoop);
    }

    function endGame() {
        gameActive = false;
        document.querySelectorAll('.falling-object').forEach(obj => obj.remove());
    }

    function toonVolgendeOefening() {
        const getal = Math.floor(Math.random() * (targetNumber - 1)) + 2;
        const deel1 = Math.floor(Math.random() * (getal + 1));
        const deel2 = getal - deel1;
        const vraagLinks = Math.random() < 0.5;

        currentSplitsing = {
            onbekend: vraagLinks ? deel1 : deel2,
        };

        splitsingContainer.innerHTML = `
            <div class="bovengetal">${getal}</div>
            <div class="lijnen"><div class="lijn lijn-links"></div><div class="lijn lijn-rechts"></div></div>
            <div class="benen">
                <div class="been">${vraagLinks ? "?" : deel1}</div>
                <div class="been">${vraagLinks ? deel2 : "?"}</div>
            </div>`;
        
        setTimeout(createPotWave, 2000);
    }

    function createPotWave() {
        if (!gameActive) return;

        const pottenInGolf = 5;
        const antwoorden = new Set([currentSplitsing.onbekend]);
        while (antwoorden.size < pottenInGolf) {
            let foutAntwoord = Math.floor(Math.random() * (targetNumber + 1));
            if(foutAntwoord !== currentSplitsing.onbekend) {
                antwoorden.add(foutAntwoord);
            }
        }

        const shuffeledAntwoorden = Array.from(antwoorden).sort(() => Math.random() - 0.5);

        for (let i = 0; i < pottenInGolf; i++) {
            createFallingObject(shuffeledAntwoorden[i], i, pottenInGolf);
        }
    }

    function createFallingObject(nummer, index, totalInWave) {
        const object = document.createElement('div');
        object.className = 'falling-object';
        object.dataset.number = nummer;
        object.innerHTML = `<img src="leerjaar1_afbeeldingen/honingpot.png" alt="honingpot"><span class="getal">${nummer}</span>`;

        const speelBreedte = gameArea.clientWidth * 0.95;
        const margeLinks = (gameArea.clientWidth - speelBreedte) / 2;
        
        const laneWidth = speelBreedte / totalInWave;
        const offset = (laneWidth - 80) / 2;
        object.style.left = `${margeLinks + (index * laneWidth) + offset}px`;
        object.style.top = '-100px';

        object.addEventListener('animationend', () => object.remove());
        
        gameArea.appendChild(object);
        
        setTimeout(() => {
            if (document.body.contains(object)) {
                 const fallDuration = (Math.random() * 5) + 15;
                 object.style.animation = `fall ${fallDuration}s linear forwards`;
            }
        }, 10);
    }

    // --- Besturing ---
    window.addEventListener('keydown', (e) => { if (keys[e.key] !== undefined) keys[e.key] = true; });
    window.addEventListener('keyup', (e) => { if (keys[e.key] !== undefined) keys[e.key] = false; });
    
    btnLinks.addEventListener('mousedown', () => keys.ArrowLeft = true);
    btnLinks.addEventListener('mouseup', () => keys.ArrowLeft = false);
    btnLinks.addEventListener('touchstart', (e) => { e.preventDefault(); keys.ArrowLeft = true; });
    btnLinks.addEventListener('touchend', () => keys.ArrowLeft = false);

    btnRechts.addEventListener('mousedown', () => keys.ArrowRight = true);
    btnRechts.addEventListener('mouseup', () => keys.ArrowRight = false);
    btnRechts.addEventListener('touchstart', (e) => { e.preventDefault(); keys.ArrowRight = true; });
    btnRechts.addEventListener('touchend', () => keys.ArrowRight = false);

    function movePlayer() {
        const currentLeft = playerContainer.offsetLeft; // Beweeg de container
        const containerWidth = gameArea.clientWidth;
        const playerWidth = playerContainer.offsetWidth;

        if (keys.ArrowLeft && currentLeft > 0) {
            playerContainer.style.left = `${Math.max(0, currentLeft - playerSpeed)}px`;
        }
        if (keys.ArrowRight && currentLeft < (containerWidth - playerWidth)) {
            playerContainer.style.left = `${Math.min(containerWidth - playerWidth, currentLeft + playerSpeed)}px`;
        }
    }

    // --- Score & Feedback ---
    function updateScore() {
        scoreJuistEl.textContent = scoreJuist;
        scoreFoutEl.textContent = scoreFout;
    }

    function handleCorrectCatch() {
        // AANGEPAST: Toon spreekballon
        speechBubble.classList.remove('hidden');
        setTimeout(() => {
            speechBubble.classList.add('hidden');
        }, 1500); // Verberg na 1.5 seconden
        
        scoreJuist++;
        oefeningTeller++;
        updateScore();
        document.querySelectorAll('.falling-object').forEach(obj => obj.remove());

        if (oefeningTeller >= TOTAAL_OEFENINGEN) {
            toonEindFeedback();
        } else {
            toonVolgendeOefening();
        }
    }

    function handleWrongCatch() {
        scoreFout++;
        updateScore();
        player.classList.add('fout', 'shake');
        setTimeout(() => player.classList.remove('fout', 'shake'), 400);
        document.querySelectorAll('.falling-object').forEach(obj => obj.remove());
        createPotWave();
    }
    
    function toonEindFeedback() {
        endGame();
        gameContainer.classList.add('hidden');
        eindFeedback.classList.remove('hidden');

        if (scoreFout === 0) {
            feedbackAfbeelding.src = 'leerjaar1_afbeeldingen/juichende_bibi.png';
            feedbackTekst.textContent = 'Dikke proficiat!';
        } else {
            feedbackAfbeelding.src = 'leerjaar1_afbeeldingen/juf_bibi.png';
            feedbackTekst.textContent = 'Goed geoefend. Probeer het volgende keer zonder fouten.';
        }
    }

    // --- Game Loop voor botsingdetectie ---
    function gameLoop() {
        if (!gameActive) return;
        movePlayer();
        
        const playerRect = player.getBoundingClientRect();
        document.querySelectorAll('.falling-object').forEach(obj => {
            const objRect = obj.getBoundingClientRect();
            const potCenterY = objRect.top + objRect.height / 2;

            if (playerRect.left < objRect.right &&
                playerRect.right > objRect.left &&
                potCenterY > playerRect.top &&
                potCenterY < playerRect.bottom) {

                const potNumber = parseInt(obj.dataset.number);
                if (potNumber === currentSplitsing.onbekend) {
                    handleCorrectCatch();
                } else {
                    handleWrongCatch();
                }
                obj.remove();
            }
        });

        requestAnimationFrame(gameLoop);
    }
});