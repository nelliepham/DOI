let isPlaying = false;
let isSpaceDown = false;
let hasStarted = false;
let videoReady = false;
let volumeInterval;

const videoA = document.getElementById('videoA');
const videoB = document.getElementById('videoB'); // Others and Sound Effects

const instruction = document.getElementById('instruction');
const playPauseButton = document.getElementById('play-pause-button');
const controlIcon = document.getElementById('control-icon');

const splashScreen = document.getElementById('splash-screen');


// Function to update sound volume based on Spacebar interaction (Custom Fade)
function updateVideoState(isHoldingSpace) {

    if (volumeInterval) {
        clearInterval(volumeInterval);
    }

    const targetA = isHoldingSpace ? 0.0 : 1.0; // Video A (Vocal) fade out
    const targetB = isHoldingSpace ? 1.0 : 0.0; // Video B (SFX) fade in

    const step = 0.05;
    const intervalTime = 20; // 20ms (fade effect)

    if (isHoldingSpace) {
        videoA.style.opacity = 0;
        videoB.style.opacity = 1;
    } else {
        videoA.style.opacity = 1;
        videoB.style.opacity = 0;
    }

    // Custom Fade
    volumeInterval = setInterval(() => {
        let currentVolA = videoA.volume;
        let currentVolB = videoB.volume;

        let newVolA = currentVolA + (isHoldingSpace ? -step : step);
        let newVolB = currentVolB + (isHoldingSpace ? step : -step);

        // Video A
        if ((isHoldingSpace && newVolA <= targetA) || (!isHoldingSpace && newVolA >= targetA)) {
            videoA.volume = targetA;
        } else {
            videoA.volume = newVolA;
        }

        // Video B
        if ((isHoldingSpace && newVolB >= targetB) || (!isHoldingSpace && newVolB <= targetB)) {
            videoB.volume = targetB;
        } else {
            videoB.volume = newVolB;
        }

        if (videoA.volume === targetA && videoB.volume === targetB) {
            clearInterval(volumeInterval);
        }
    }, intervalTime);

    videoA.muted = false;
    videoB.muted = false;
}


// 3. Function to start music (Called only once)
function startMusic() {
    if (hasStarted) return;

    // 1. Ẩn Splash Screen
    splashScreen.style.opacity = 0;
    setTimeout(() => { splashScreen.style.display = 'none'; }, 500);

    // 2. KHỞI TẠO VIDEO
    videoA.muted = false;
    videoB.muted = false;

    // Bắt đầu Playback
    let playPromiseA = videoA.play();
    let playPromiseB = videoB.play();

    if (playPromiseA !== undefined && playPromiseB !== undefined) {
        Promise.all([playPromiseA, playPromiseB])
            .then(() => {
                // ĐỒNG BỘ: Sửa lỗi Video bị loạn khi khởi động
                videoB.currentTime = videoA.currentTime;
                videoB.pause(); // Dừng B để chỉ A chạy

                // Đặt Volume ban đầu (A=1.0, B=0.0)
                videoA.volume = 1.0;
                videoB.volume = 0.0;

                // Cập nhật trạng thái
                isPlaying = true;
                hasStarted = true;

                // Cập nhật UI
                playPauseButton.style.display = 'flex';
                controlIcon.textContent = '❚❚';
            })
            .catch(error => {
                console.error("Video Playback Failed:", error);
                alert("Lỗi: Video không tương thích! Vui lòng kiểm tra lại cấu hình export.");
            });
    } else {

        videoA.volume = 1.0;
        videoB.volume = 0.0;
        videoA.play();
        videoB.pause();
        videoB.currentTime = videoA.currentTime;
        isPlaying = true;
        hasStarted = true;
    }

    // 4. UI
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