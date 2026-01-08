const music = document.querySelector('audio');
const prevBtn = document.getElementById('prev');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const image = document.querySelector('img');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

// music
const songs = [
    {
        name: 'jacinto-1',
        displayName: 'Electric Chill Machine',
        artist: 'Jacinto Design',
    },
    {
        name: 'jacinto-2',
        displayName: 'Seven Nation Army (Remix)',
        artist: 'Jacinto Design',
    },
    {
        name: 'jacinto-3',
        displayName: 'Goodnight, Disco Queen',
        artist: 'Jacinto Design',
    },
    {
        name: 'metric-1',
        displayName: 'Front Row (Remix)',
        artist: 'Metric/Jacinto Design',
    }
]

// check if playing
let isPlaying = false;

// play
function playSong() {
    isPlaying = true;
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
    music.play();
}

// pause
function pauseSong() {
    isPlaying = false;
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
    music.pause();
}

// play/pause
playBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));

// Update DOM
function loadSong(song) {
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    music.src = `music/${song.name}.mp3`;
    image.src = `img/${song.name}.jpg`;
}

// current song
let songIdx = 0;

// prev song
function prevSong() {
    songIdx--;
    if (songIdx < 0) songIdx = songs.length - 1;
    loadSong(songs[songIdx]);
    playSong();
}

// next song
function nextSong() {
    songIdx++;
    if (songIdx > songs.length - 1) songIdx = 0;
    loadSong(songs[songIdx]);
    playSong();
}

// on Load - select first song
loadSong(songs[songIdx]);

// update prog bar and time
function updateProgressBar(e) {
    if (isPlaying) {
        const {duration, currentTime} = e.srcElement;
        // update prog bar width
        const progressPercent = (currentTime/duration) * 100;
        progress.style.width = `${progressPercent}%`;  
        
        // calc duration
        const durMin = Math.floor(duration / 60);
        let durSec = Math.floor(duration % 60);
        if (durSec < 10) durSec = `0${durSec}`;
        if (durSec) durationEl.textContent = `${durMin}:${durSec}`;

        // calc current time
        let curMin = Math.floor(currentTime / 60);
        let curSec = Math.floor(currentTime % 60);
        if (curSec < 10) curSec = `0${curSec}`;
        if (curSec) currentTimeEl.textContent = `${curMin}:${curSec}`;
    }
}

// set prog bar
function setProgressBar(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const {duration} = music;
    music.currentTime = (clickX/width) * duration;
}

// Event listeners
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
music.addEventListener('ended', nextSong)
music.addEventListener('timeupdate', updateProgressBar);
progressContainer.addEventListener('click', setProgressBar);