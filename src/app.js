const audioPlayer = document.getElementById('audioPlayer');
const prevButton = document.getElementById('prevButton');
const playButton = document.getElementById('playButton');
const nextButton = document.getElementById('nextButton');
const stopButton = document.getElementById('stopButton');

const audioFiles = [
  '/1.mp3',
  '/2.mp3',
  '/3.mp3',
  '/4.mp3',

];

let currentAudioIndex = 0;

function loadAudio() {
  audioPlayer.src = audioFiles[currentAudioIndex];
}

function playAudio() {
  audioPlayer.play();
}

function pauseAudio() {
  audioPlayer.pause();
}

function playPrevious() {
  currentAudioIndex = (currentAudioIndex - 1 + audioFiles.length) % audioFiles.length;
  loadAudio();
  playAudio();
}

function playNext() {
  currentAudioIndex = (currentAudioIndex + 1) % audioFiles.length;
  loadAudio();
  playAudio();
}

prevButton.addEventListener('click', playPrevious);
playButton.addEventListener('click', playAudio);
nextButton.addEventListener('click', playNext);
stopButton.addEventListener('click', pauseAudio);


// Load the initial audio
loadAudio();
