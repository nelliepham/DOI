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

    // // 2. KHỞI TẠO VIDEO (Quan trọng: Đặt volume/muted trước Play)
    videoA.muted = false;
    videoB.muted = false;

    // Bắt đầu Playback
    let playPromiseA = videoA.play();
    let playPromiseB = videoB.play();

    // Thêm logic xử lý Promise để đảm bảo Playback thành công
    if (playPromiseA !== undefined && playPromiseB !== undefined) {
        Promise.all([playPromiseA, playPromiseB])
            .then(() => {
                videoB.currentTime = videoA.currentTime; // Đồng bộ

                // GỌI HÀM UPDATE VIDEO STATE ĐỂ ĐẶT VOLUME MƯỢT MÀ
                updateVideoState(false);
            })
            .catch(error => {
                console.error("Video Playback Failed:", error);
                // Tạm thời bật tiếng video để kiểm tra
                videoA.muted = true;
                videoB.muted = true;
                alert("Error! Vui lòng xuất lại video.");
            });
    }

    // Cập nhật trạng thái
    isPlaying = true;
    hasStarted = true;

    // ... (logic hiển thị UI giữ nguyên) ...
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