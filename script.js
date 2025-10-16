let isPlaying = false;
let isSpaceDown = false;
let hasStarted = false;
let videoReady = false; // Biến kiểm tra video đã load chưa

const videoA = document.getElementById('videoA'); // Video Gốc (Vocal ON)
const videoB = document.getElementById('videoB'); // Video Tương tác (Vocal OFF)

const instruction = document.getElementById('instruction');
const playPauseButton = document.getElementById('play-pause-button');
const controlIcon = document.getElementById('control-icon');

const splashScreen = document.getElementById('splash-screen');


// Function to update sound volume based on Spacebar interaction (Custom Fade)
function updateVideoState(isHoldingSpace) {
    if (isHoldingSpace) {

        videoA.style.opacity = 0;
        videoB.style.opacity = 1;


        videoA.muted = true;
        videoB.muted = false;

    } else {

        videoA.style.opacity = 1;
        videoB.style.opacity = 0;

        videoA.muted = false;
        videoB.muted = true;
    }
}


// 3. Function to start music (Called only once)
function startMusic() {
    if (hasStarted) return;

    splashScreen.style.opacity = 0;
    setTimeout(() => { splashScreen.style.display = 'none'; }, 500);


    videoA.muted = false;
    videoB.muted = true;

    videoA.play();
    videoB.play();


    videoB.currentTime = videoA.currentTime;


    isPlaying = true;
    hasStarted = true;


    playPauseButton.style.display = 'flex';
    controlIcon.textContent = '❚❚';
}

// 4. Function to toggle Play/Pause
function togglePlayPause() {
    if (videoA.paused) {

        videoA.play();
        videoB.play();
        controlIcon.textContent = '❚❚';
        isPlaying = true;
    } else {

        videoA.pause();
        videoB.pause();
        controlIcon.textContent = '▶';
        isPlaying = false;
    }
}



// Keydown event handler (for starting and muting) 
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        e.preventDefault();

        if (!hasStarted) {
            startMusic();
        }

        if (!isSpaceDown) {
            isSpaceDown = true;
            updateVideoState(true);
        }
    }
});


document.addEventListener('keyup', (e) => {
    if (e.key === ' ') {
        isSpaceDown = false;
        updateVideoState(false);
    }
});

// Attach event listener to Play/Pause button
playPauseButton.addEventListener('click', togglePlayPause);

// Initialize sound state (Vocal ON by default)
updateVideoState(false);