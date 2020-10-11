// ================= //
// Whack-a-Mole Game //
// ================= //

const app = (function(){

    // Game elements

    const holes = document.querySelectorAll(".hole");
    const timer = document.querySelector(".timer__value");
    const hitCounter = document.querySelector(".hits__value");
    const modal = document.querySelector(".modal");

    const startButton = document.querySelector(".controls .button--start");
    const stopButton = document.querySelector(".controls .button--stop");
    const resetButton = document.querySelector(".controls .button--reset");
    const closeButton = document.querySelector(".modal .button--close");

    // Game settings

    const maxTime = 30; // length of the game in seconds
    const minDelay = 500; // min milliseconds to show a mole
    const maxDelay = 1500; // max milliseconds to show a mole

    let game = {},
        prevHoleIndex;

    // Game utility methods

    function getRandomDelay(min, max){
        return Math.floor(Math.random() * (max - min) + min);
    }

    function getRandomHole(holes){
        const newHoleIndex = Math.floor(Math.random() * holes.length);

        // Don't repeat the same hole back-to-back
        if (newHoleIndex === prevHoleIndex) return getRandomHole(holes);

        prevHoleIndex = newHoleIndex;
        return holes[newHoleIndex];
    }

    function getResults(totalHits, totalMoles) {
        const score = `You hit ${totalHits} out of ${totalMoles} moles.`;
        let comment = "";

        if (!totalHits) comment = ":( Oops...";
        if (totalHits && totalHits < totalMoles / 2) comment = "Better luck next time!";
        if (totalHits > totalMoles / 2 && totalHits < (totalMoles - (totalMoles / 4))) comment = "Not too shabby!";
        if (totalHits > (totalMoles - (totalMoles / 4))) comment = "Nice job!";

        return `${score}<br/>${comment}`;
    }

    function setActiveButton(button) {
        // Clear any existing disabled button states
        const gameControls = document.querySelectorAll(".controls button");
        gameControls.forEach(button => {
            button.removeAttribute("disabled");
        });

        if (!button) return;
        if (!button.classList.contains("button--reset")) {
            button.setAttribute("disabled", true);
        }
    }

    // Game objects (would-be classes)

    function newMoles(holes){
        if (!holes) return;

        let thisGame = null,
            totalMoles = 0;

        function startMoles() {
            thisGame = setInterval(() => {
                // Add a mole to a random hole
                const randomHole = getRandomHole(holes);
                showMole(randomHole);
                ++totalMoles;
            }, 800);
        }

        function stopMoles() {
            // Clear any active moles
            // Stop showing additional moles
            holes.forEach(hole => hole.classList.remove("mole"));
            clearInterval(thisGame);
        }

        function resetMoles(){
            // Clear any active moles
            // Stop showing additional moles
            // Reset the number of moles shown
            holes.forEach(hole => hole.classList.remove("mole"));
            clearInterval(thisGame);
            totalMoles = 0;
        }

        return {
            start: startMoles,
            stop: stopMoles,
            reset: resetMoles,
            getMoles: () => totalMoles
        };
    }

    function newHitCounter(hitCounter, initialHits = 0){
        let currentHits = initialHits;

        function recordHit(){
            hitCounter.textContent = ++currentHits;
        }

        function resetHits(){
            if (currentHits < 1) return;
            currentHits = 0;
            hitCounter.textContent = currentHits;
        }

        return {
            hit: recordHit,
            reset: resetHits,
            getHits: () => currentHits
        };
    }

    function newTimer(timer, maxTime = 30) {
        let thisTimer = null,
            running = false,
            seconds = maxTime;

        // Set our initial time display
        timer.textContent = `00:${seconds}`;

        function startTimer() {
            // Count down from the max seconds and update the clock
            thisTimer = setInterval(() => {
                running = true;

                if (seconds > 0) seconds = --seconds;
                if (seconds === 0) {
                    // Game Over!
                    running = false;
                    clearInterval(thisTimer);
                    game.moles.stop();
                    showEndModal();
                }
                timer.textContent = `00:${seconds < 10 ? `0${seconds}` : seconds}`;
            }, 1000);
        }

        function stopTimer() {
            if (!running) return;
            running = false;
            clearInterval(thisTimer);
        }

        function resetTimer() {
            running = false;
            clearInterval(thisTimer);
            seconds = maxTime;

            timer.textContent = `00:${seconds}`;
        }

        return {
            start: startTimer,
            stop: stopTimer,
            reset: resetTimer,
            isRunning: () => running
        };
    }

    // Game events

    function startGame(e){
        if (game.timer.isRunning()) return;
        if (e) setActiveButton(e.target);
        game.timer.start();
        game.moles.start();
    }

    function stopGame(e){
        if (!game.timer.isRunning()) return;
        if (e) setActiveButton(e.target);
        game.timer.stop();
        game.moles.stop();
    }

    function resetGame(e){
        if (e) setActiveButton(e.target);
        game.timer.reset();
        game.counter.reset();
        game.moles.reset();
    }

    function showMole(hole) {
        const randomDelay = getRandomDelay(minDelay, maxDelay);

        // Add a mole to the hole
        // Then remove the mole after random delay
        hole.classList.add("mole");
        setTimeout(() => {
            hole.classList.remove("mole");
        }, randomDelay);
    }

    function hitMole(e) {
        // Abort mission if it's not a valid hit
        if (!e.target.classList.contains("mole")) return;

        // Vanquish the mole
        // Update the hit counter
        e.target.classList.remove("mole");
        game.counter.hit();
    }

    function showEndModal() {
        const message = modal.querySelector(".message");

        document.body.classList.add("body--modal");
        modal.style.display = "block";
        message.innerHTML = getResults(game.counter.getHits(), game.moles.getMoles());

        setTimeout(() => {
            modal.classList.add("modal--open");
        }, 700);
    }

    function closeEndModal() {
        resetGame();
        setActiveButton();
        modal.classList.remove("modal--open");

        setTimeout(() => {
            modal.style.display = "none";
            document.body.classList.remove("body--modal");
        }, 500);
    }

    // Game initialization

    return {
        init: function(){
            /* If we're missing any of the key game board elements,
               disable the game and display an error message instead. */
            if (
                !timer || 
                !modal || 
                !hitCounter || 
                !stopButton ||
                !startButton ||
                !resetButton ||
                !closeButton ||
                holes.length < 3
            ) {
                let errorModal;

                if (!modal) {
                    errorModal = document.createElement("div");
                    errorModal.classList.add("modal");
                    document.body.appendChild(errorModal);
                } else {
                    errorModal = modal;
                }

                errorModal.innerHTML = `
                    <div class="modal__wrap">
                        <h2>Sorry!</h2>
                        <p>Something didn't load quite right this time.</p>
                    </div>
                `;
                errorModal.style.display = "block";

                setTimeout(() => {
                    errorModal.classList.add("modal--open");
                }, 200);

                return;
            }

            // Set up the moles, timer and hit counter
            game.moles = newMoles(holes, minDelay, maxDelay);
            game.timer = newTimer(timer, maxTime);
            game.counter = newHitCounter(hitCounter, 0);

            // Hook up our event listeners
            holes.forEach(hole => hole.addEventListener("click", hitMole));
            startButton.addEventListener("click", startGame);
            stopButton.addEventListener("click", stopGame);
            resetButton.addEventListener("click", resetGame);
            closeButton.addEventListener("click", closeEndModal);
        }
    };
})();

export default app;