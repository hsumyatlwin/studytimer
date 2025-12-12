let time = 0;
let timerInterval = null;
let isPaused = false;

const timerDisplay = document.getElementById("timer");
const hoursInput = document.getElementById("hoursInput");
const minutesInput = document.getElementById("minutesInput");
const secondsInput = document.getElementById("secondsInput");
const setBtn = document.getElementById("setBtn");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const musicBtn = document.getElementById("musicBtn");
const musicPlayer = document.getElementById("musicPlayer");
const audioPlayer = document.getElementById("audioPlayer");
const nowPlaying = document.getElementById("nowPlaying");
const musicItems = document.querySelectorAll(".music-item");

//music section

musicBtn.addEventListener("click", function () {
    musicPlayer.classList.toggle("hidden");
    if (musicPlayer.classList.contains("hidden")) {
        musicBtn.textContent = "🎵 Music";
        audioPlayer.pause();
    } else {
        musicBtn.textContent = "🔇 Hide Music";
    }
});

musicItems.forEach(item => {
    item.addEventListener("click", function () {
        const musicSrc = this.getAttribute("data-src");
        const musicName = this.querySelector("span:last-child").textContent;

        audioPlayer.src = musicSrc;
        audioPlayer.load();
        audioPlayer.play();

        nowPlaying.textContent = `Now Playing: ${musicName}`;

        musicItems.forEach(i => i.classList.remove("active"));
        this.classList.add("active");
    });
});

//timer logic

function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function updateDisplay() {
    timerDisplay.textContent = formatTime(time);
}

function setTime() {
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;

    time = (hours * 3600) + (minutes * 60) + seconds;
    updateDisplay();
}

function countdown() {
    if (time > 0) {
        time--;
        updateDisplay();
    } else {
        stopTimer();
        audioPlayer.pause();
        alert("⏰ Time's up!");
    }
}

function startTimer() {
    if (timerInterval === null) {
        if (time === 0) {
            setTime();
        }
        if (time > 0) {
            timerInterval = setInterval(countdown, 1000);
            isPaused = false;
            startBtn.textContent = "Running...";
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            setBtn.disabled = true;

            hoursInput.disabled = true;
            minutesInput.disabled = true;
            secondsInput.disabled = true;

            if (!musicPlayer.classList.contains("hidden")) {
                audioPlayer.play().catch(err => console.log("Audio play failed:", err));
            }
        }
    }
}

function pauseTimer() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
        isPaused = true;
        startBtn.textContent = "Resume";
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        audioPlayer.pause();
    }
}

function stopTimer() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    isPaused = false;
}

function resetTimer() {
    stopTimer();
    setTime();
    startBtn.textContent = "Start";
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    setBtn.disabled = false;

    hoursInput.disabled = false;
    minutesInput.disabled = false;
    secondsInput.disabled = false;

    audioPlayer.pause();
    audioPlayer.currentTime = 0;
}

setBtn.addEventListener("click", setTime);
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

hoursInput.addEventListener("input", function () {
    if (timerInterval === null && !isPaused) setTime();
});
minutesInput.addEventListener("input", function () {
    if (timerInterval === null && !isPaused) setTime();
});
secondsInput.addEventListener("input", function () {
    if (timerInterval === null && !isPaused) setTime();
});

setTime();
pauseBtn.disabled = true;