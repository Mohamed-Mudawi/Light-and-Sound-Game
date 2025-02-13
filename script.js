// Mohamed Mudawi, Futureforce Tech Launch Pad Project
let pattern = [2, 2, 4, 3, 2, 1, 2, 4];  // Will change
let progress = 0;
let gamePlaying = false;
let guessCounter = 0;
let volume = 0.5;
let tonePlaying = false;
const clueHoldTime = 1000;  
const cluePauseTime = 333;   
const nextClueWaitTime = 1000; 
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

// Start the game
function startGame() {
  pattern = Array.from({ length: 8 }, () => Math.floor(Math.random() * 4) + 1);
  progress = 0;
  gamePlaying = true;
  startBtn.classList.add("hidden");
  stopBtn.classList.remove("hidden");
  playClueSequence();
}

// Stop the game
function stopGame() {
  gamePlaying = false;
  startBtn.classList.remove("hidden");
  stopBtn.classList.add("hidden");
}

// Plays a clue
function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

// Plays the sequence of clues
function playClueSequence() {
  context.resume();
  guessCounter = 0;
  let delay = nextClueWaitTime;
  for (let i = 0; i <= progress; i++) {
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]);
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

// When user guesses
function guess(btn) {
  console.log("User guessed: " + btn);
  if (!gamePlaying) {
    return;
  }

  if (pattern[guessCounter] === btn) {
    if (guessCounter === progress) {
      if (progress === pattern.length - 1) {
        winGame();
      } else {
        progress++;
        playClueSequence();
      }
    } else {
      guessCounter++;
    }
  } else {
    loseGame();
  }
}

// When user loses
function loseGame() {
  stopGame();
  alert("Game Over. You lost.");
}

// When user wins
function winGame() {
  stopGame();
  alert("Congratulations! You won!");
}

// Lights up the button
function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}

// Clears up the button
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

// Sound Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
};

function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function() {
    stopTone();
  }, len);
}

function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}

function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// --- Page Initialization: Set up the Sound Synthesizer ---
let AudioContext = window.AudioContext || window.webkitAudioContext;
let context = new AudioContext();
let o = context.createOscillator();
let g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);