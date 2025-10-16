// ===========================================
// KHAI BÁO BIẾN TOÀN CỤC VÀ KHỞI TẠO TRACK
// PHẢI ĐƯỢC ĐẶT Ở ĐẦU FILE
// ===========================================

// Biến trạng thái
let isPlaying = false;
let isSpaceDown = false;
let hasStarted = false;
let currentSceneIndex = 0;
let sceneInterval;

// Track Nhạc (Khai báo trước khi dùng)
const otherTrack = new Howl({
    src: ['music/DOI_other.mpm3'],
    loop: true,
    volume: 1.0,
});
const vocalTrack = new Howl({
    src: ['music/DOI_vocals.mp3'],
    loop: true,
    volume: 1.0,
});
const timeTrack = otherTrack; // Dùng OtherTrack để theo dõi thời gian

// Lấy phần tử HTML (Sau khi khai báo các Track)
const sceneElement = document.getElementById('scene');
const playPauseButton = document.getElementById('play-pause-button');
const controlIcon = document.getElementById('control-icon');


// ===========================================
// ĐỊNH NGHĨA CÁC HÀM (FUNCTION)
// PHẢI ĐƯỢC ĐẶT TRƯỚC LỆNH GỌI
// ===========================================

// Ánh xạ thời gian và tên file scene
const sceneMap = [
    { time: 0, file: 'scene/scene1.png' },
    { time: 29, file: 'scene/scene2.png' },
    { time: 39, file: 'scene/scene3.png' },
    { time: 51, file: 'scene/scene4.png' },
    { time: 61, file: 'scene/scene5.png' },
    { time: 71, file: 'scene/scene6.png' },
    { time: 197, file: 'scene/scene6.png' }
];

// 1. Cập nhật Scene theo thời gian (Đã fix lỗi sắp xếp)
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

// 2. Cập nhật Âm thanh khi nhấn Spacebar
function updateSoundState(isHoldingSpace) {
    const fadeDuration = 100; // 0.1 giây để tạo độ mượt

    if (isHoldingSpace) {
        // TRẠNG THÁI SPACEBAR GIỮ: FADE Vocal XUỐNG 0.0
        // Nhạc cụ (otherTrack) VẪN Ở 1.0
        vocalTrack.fade(vocalTrack.volume(), 0.0, fadeDuration);
        otherTrack.volume(1.0);
    } else {
        // TRẠNG THÁI MẶC ĐỊNH: FADE Vocal LÊN 1.0
        // Nhạc cụ (otherTrack) VẪN Ở 1.0
        vocalTrack.fade(vocalTrack.volume(), 1.0, fadeDuration);
        otherTrack.volume(1.0);
    }
}

// 3. Hàm Khởi động Nhạc (Chỉ gọi 1 lần)
function startMusic() {
    if (hasStarted) return;

    // Bắt đầu chơi cả hai track
    otherTrack.play();
    vocalTrack.play();

    // Khởi động vòng lặp chuyển cảnh
    sceneInterval = setInterval(updateScene, 500);

    // Đánh dấu đã bắt đầu
    isPlaying = true;
    hasStarted = true;

    // Hiển thị nút Play/Pause và cập nhật icon
    playPauseButton.style.display = 'flex';
    controlIcon.textContent = '❚❚';

    // ẨN INSTRUCTION (Vì nhạc đã bắt đầu)
    document.getElementById('instruction').style.display = 'none';
}

// 4. Hàm Play/Pause (Dùng cho nút bấm)
function togglePlayPause() {
    if (isPlaying) {
        // Dừng nhạc (Pause)
        otherTrack.pause();
        vocalTrack.pause();
        clearInterval(sceneInterval);

        controlIcon.textContent = '▶';
        isPlaying = false;
    } else {
        // Chơi nhạc (Resume)
        otherTrack.play();
        vocalTrack.play();
        sceneInterval = setInterval(updateScene, 500);

        controlIcon.textContent = '❚❚';
        isPlaying = true;

        // Đảm bảo trạng thái âm thanh Spacebar đang hoạt động
        updateSoundState(isSpaceDown);
    }
}


// ===========================================
// GÁN SỰ KIỆN VÀ KHỞI TẠO BAN ĐẦU
// ===========================================

// Xử lý sự kiện khi nhấn phím (keydown)
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        e.preventDefault();

        // 1. LOGIC KHỞI ĐỘNG (BƯỚC 1)
        if (!hasStarted) {
            startMusic();
        }

        // 2. LOGIC TƯƠNG TÁC (CHỈ KHI ĐANG CHƠI và Spacebar CHƯA GIỮ)
        if (isPlaying && !isSpaceDown) {
            isSpaceDown = true;
            updateSoundState(true); // Tắt vocal (FADE OUT)
        }
    }
});

// Xử lý sự kiện khi nhả phím (keyup)
document.addEventListener('keyup', (e) => {
    if (e.key === ' ' && isPlaying) {
        isSpaceDown = false;
        updateSoundState(false); // Bật vocal (FADE IN)
    }
});

// Gán sự kiện cho nút Play/Pause
playPauseButton.addEventListener('click', togglePlayPause);

// Cập nhật trạng thái âm thanh mặc định (Vocal ON)
updateSoundState(false);