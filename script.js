let isPlaying = false;
let isSpaceDown = false;
let hasStarted = false;
let currentSceneIndex = 0;
let sceneInterval;
let fadeInterval;

// Audio Tracks 
const otherTrack = new Howl({
    src: ['music/DOI_other.mp3'],
    loop: true,
    volume: 1.0,
    format: ['mp3']
});
const vocalTrack = new Howl({
    src: ['music/DOI_vocals.mp3?v=1'],
    loop: true,
    volume: 1.0,
    format: ['mp3']
});
const timeTrack = otherTrack; // Use OtherTrack to track playback time


// HTML Element references
const sceneElement = document.getElementById('scene');
const playPauseButton = document.getElementById('play-pause-button');
const controlIcon = document.getElementById('control-icon');

// Scene Map (Still images for now, later will be replaced with animation video)
const sceneMap = [
    { time: 0, file: 'scene/scene1.png' },
    { time: 29, file: 'scene/scene2.png' },
    { time: 39, file: 'scene/scene3.png' },
    { time: 51, file: 'scene/scene4.png' },
    { time: 61, file: 'scene/scene5.png' },
    { time: 71, file: 'scene/scene6.png' },
    { time: 197, file: 'scene/scene6.png' }
];

// Function to update the scene based on timeline (later will be replaced with animation video)
function updateScene() {
    const currentTime = Math.floor(timeTrack.seek() || 0);

    for (let i = currentSceneIndex + 1; i < sceneMap.length; i++) {
        if (currentTime >= sceneMap[i].time) {
            currentSceneIndex = i;
            const nextSceneFile = sceneMap[currentSceneIndex].file;
            sceneElement.style.backgroundImage = `url('${nextSceneFile}')`;
            console.log(`Scene changed to: ${nextSceneFile} at ${currentTime}s`);
        } else {
            break;
        }
    }
}

// Function to update sound volume based on Spacebar interaction (Custom Fade)
function updateSoundState(isHoldingSpace) {
    // 1. Stop old interval to prevent conflicts
    if (fadeInterval) {
        clearInterval(fadeInterval);
    }

    // Set the target and step size
    const targetVolume = isHoldingSpace ? 0.0 : 1.0; // 0.0 is MUTE, 1.0 is FULL VOLUME
    const step = isHoldingSpace ? -0.05 : 0.05;    // Step size for smooth transition

    // Ensure the background track is always at full volume
    otherTrack.volume(1.0);

    // If already at target volume, skip fade process
    if (vocalTrack.volume() === targetVolume) {
        return;
    }

    // Start the new Custom Fade Interval
    fadeInterval = setInterval(() => {
        let currentVolume = vocalTrack.volume();
        let newVolume = currentVolume + step;

        // CHECK STOP CONDITION: When target volume is reached or surpassed
        if ((step > 0 && newVolume >= targetVolume) || (step < 0 && newVolume <= targetVolume)) {
            newVolume = targetVolume;
            clearInterval(fadeInterval); // Stop the interval
        }

        // Apply new volume
        vocalTrack.volume(newVolume);
    }, 15); // Update every 15ms for smooth fade effect
}


// 3. Function to start music (Called only once)
function startMusic() {
    if (hasStarted) return;

    // Only play OTHER TRACK immediately
    otherTrack.play();

    // Ensure Vocal is played only after it's loaded (prevents missing sound)
    vocalTrack.once('load', function () {
        vocalTrack.play();
        console.log("Vocal Loaded and Started.");
    });

    // Fallback: If Vocal loaded before the 'once' listener, play it immediately
    if (vocalTrack.state() === 'loaded') {
        vocalTrack.play();
    }

    // Start scene loop
    sceneInterval = setInterval(updateScene, 500);

    // Set state flags
    isPlaying = true;
    hasStarted = true;

    // Display control buttons and hide instruction
    playPauseButton.style.display = 'flex';
    controlIcon.textContent = '❚❚';

    document.getElementById('instruction').style.display = 'none';
}

// 4. Function to toggle Play/Pause
function togglePlayPause() {
    if (isPlaying) {
        // State: Playing -> Pause
        otherTrack.pause();
        vocalTrack.pause();
        clearInterval(sceneInterval);

        controlIcon.textContent = '▶';
        isPlaying = false;
    } else {
        // State: Paused -> Resume
        otherTrack.play();
        vocalTrack.play();
        sceneInterval = setInterval(updateScene, 500);

        controlIcon.textContent = '❚❚';
        isPlaying = true;

        // Ensure Spacebar effect is applied if key is already held
        updateSoundState(isSpaceDown);
    }
}



// Keydown event handler (for starting and muting)
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        e.preventDefault();

        // 1. START LOGIC (RUNS ONLY ONCE)
        if (!hasStarted) {
            startMusic();
        }

        // 2. INTERACTION LOGIC (MUTE VOCAL)
        if (isPlaying && !isSpaceDown) {
            isSpaceDown = true;
            updateSoundState(true); // Fade OUT (Mute Vocal)
        }
    }
});

// Keyup event handler (for unmuting)
document.addEventListener('keyup', (e) => {
    if (e.key === ' ' && isPlaying) {
        isSpaceDown = false;
        updateSoundState(false); // Fade IN (Unmute Vocal)
    }
});

// Attach event listener to Play/Pause button
playPauseButton.addEventListener('click', togglePlayPause);

// Initialize sound state (Vocal ON by default)
updateSoundState(false);