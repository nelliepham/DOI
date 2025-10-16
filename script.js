let isPlaying = false;
let isSpaceDown = false;
let hasStarted = false;
let videoReady = false; // Biến kiểm tra video đã load chưa

const videoA = document.getElementById('videoA'); // Video Gốc (Vocal ON)
const videoB = document.getElementById('videoB'); // Video Tương tác (Vocal OFF)

const instruction = document.getElementById('instruction');
const playPauseButton = document.getElementById('play-pause-button');
const controlIcon = document.getElementById('control-icon');

// Function to update sound volume based on Spacebar interaction (Custom Fade)
function updateVideoState(isHoldingSpace) {
    if (isHoldingSpace) {
        // GIỮ: Hiện Clip B (Vocal OFF)
        videoA.style.opacity = 0; // Ẩn A
        videoB.style.opacity = 1; // Hiện B
    } else {
        // NHẢ: Hiện Clip A (Vocal ON)
        videoA.style.opacity = 1; // Hiện A
        videoB.style.opacity = 0; // Ẩn B
    }
}


// 3. Function to start music (Called only once)
function startMusic() {
    if (hasStarted) return;

    // Bỏ MUTED và Play video
    videoA.muted = false;
    videoB.muted = false;

    // Cần gọi Play() vì Autoplay thường bị chặn cho đến khi user tương tác
    videoA.play();
    videoB.play();

    // Đồng bộ video B theo video A (đảm bảo chúng chạy cùng mốc)
    videoB.currentTime = videoA.currentTime;

    // Thiết lập trạng thái
    isPlaying = true;
    hasStarted = true;

    // Hiển thị nút controls và ẩn instruction
    playPauseButton.style.display = 'flex';
    controlIcon.textContent = '❚❚';
    instruction.style.display = 'none';
}

// 4. Function to toggle Play/Pause
function togglePlayPause() {
    if (videoA.paused) {
        // Nếu đang DỪNG -> Tiếp tục
        videoA.play();
        videoB.play();
        controlIcon.textContent = '❚❚';
        isPlaying = true;
    } else {
        // Nếu đang CHƠI -> Dừng
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
        updateVideoState(false); // Hiện Clip A (Vocal ON)
    }
});

// Attach event listener to Play/Pause button
playPauseButton.addEventListener('click', togglePlayPause);

// Initialize sound state (Vocal ON by default)
updateVideoState(false);