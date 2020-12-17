import getBlobDuration from "get-blob-duration";

const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayButton");
const volumeBtn = document.getElementById("jsVolumeButton");
const fullScreenBtn = document.getElementById("jsFullScreen");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("jsVolume");
const progressBar = document.getElementById("jsProgressRangeBar");
const leftBtn = document.getElementById("jsLeftBtn");
const rightBtn = document.getElementById("jsRightBtn");
const filledBar = document.getElementById("jsFilledBar");
const controlBar = document.getElementById("jsControlBar");

// Match Media(JS)
const element = document.querySelector(".videoPlayer__Bar");
const newProgressBar = document.createElement("div");
const newFilledBar = document.createElement("div");

let timer;

// 비디오를 끝까지 재생하면 백엔드에 데이터를 요청하는 API
const registerView = () => {
    const videoId = window.location.href.split("/videos/")[1];
    fetch(`/api/${videoId}/view`, {
        method: "POST",
    });
};

// 맨 처음 비디오가 로드되었을 때 재생상태이면 pause버튼을 아니라면 play버튼을 보여주게 함!
function handleVideoPlayer() {
    if (videoPlayer.played) {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

// Video Player에 마우스가 올라가 있는 상태에서 스페이스바를 누르면 발생하는 이벤트 함수
function handlePlaySpace(event) {
    if (videoPlayer.paused) {
        if (event.keyCode === 32) {
            videoPlayer.play();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
    } else if (event.keyCode === 32) {
        videoPlayer.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

// 재생버튼을 클릭하면 발생하는 이벤트 함수
function handlePlayClick() {
    if (videoPlayer.paused) {
        videoPlayer.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        videoPlayer.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

// Volume버튼을 클릭하면 발생하는 이벤트 함수
function handleVolumeClick() {
    if (videoPlayer.muted) {
        videoPlayer.muted = false;
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        volumeRange.value = videoPlayer.volume;
    } else {
        volumeRange.value = 0;
        videoPlayer.muted = true;
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

// 비디오에 마우스가 올라가면 3초 후에 발생하는 이벤트
function handleTransparent() {
    controlBar.style.opacity = "0";
    videoPlayer.style.cursor = "none";
    progressBar.style.opacity = "0";
    //모바일 버전 newProgressBar
    newProgressBar.style.opacity = "0";
}

// 비디오가 로드되고 3초동안 발생하는 이벤트
function handleVideoStart() {
    controlBar.style.opacity = "1";
    progressBar.style.opacity = "1";
    //모바일 버전 newProgressBar
    newProgressBar.style.opacity = "1";
    clearTimeout(timer);
    timer = setTimeout(handleTransparent, 3000);
}
// 비디오에 마우스가 올라가면 3초동안 발생하는 이벤트
function handleMouse() {
    controlBar.style.opacity = "1";
    videoPlayer.style.cursor = "pointer";
    progressBar.style.opacity = "1";
    //모바일 버전 newProgressBar
    newProgressBar.style.opacity = "1";
    clearTimeout(timer);
    timer = setTimeout(handleTransparent, 3000);
}

// Full Screen 상태에서 상태변화를 감지하면 발생하는 이벤트
function exitHandler() {
    if (!document.fullscreenElement &&
        !document.webkitIsFullScreen &&
        !document.mozFullScreen &&
        !document.msFullscreenElement
    ) {
        // ESC키를 누르면 전체화면버튼으로 바뀜
        fullScreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        fullScreenBtn.addEventListener("click", goFullScreen);
    }
}

// 원래화면버튼을 누르면 발생하는 이벤트함수
function exitFullScreen() {
    fullScreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    fullScreenBtn.addEventListener("click", goFullScreen);
    if (document.exitFullScreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullScreen) {
        document.msExitFullScreen();
    }
}

// 전체화면버튼을 누르면 발생하는 이벤트함수
function goFullScreen() {
    if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
    } else if (videoContainer.mozRequestFullScreen) {
        videoContainer.mozRequestFullScreen();
    } else if (videoContainer.webkitRequestFullscreen) {
        videoContainer.webkitRequestFullscreen();
    } else if (videoContainer.msRequestFullscreen) {
        videoContainer.msRequestFullscreen();
    }
    fullScreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    fullScreenBtn.removeEventListener("click", goFullScreen);
    fullScreenBtn.addEventListener("click", exitFullScreen);
    document.addEventListener("fullscreenchange", exitHandler);
    document.addEventListener("webkitfullscreenchange", exitHandler);
    document.addEventListener("mozfullscreenchange", exitHandler);
    document.addEventListener("MSFullscreenChange", exitHandler);
}

// 비디오 시간을 알맞게 조정해주는 함수
const formatDate = (seconds) => {
    const secondsNumber = parseInt(seconds, 10);
    let hours = Math.floor(secondsNumber / 3600);
    let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
    let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

    if (hours < 10) {
        hours = `0${hours}`;
    }
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    if (totalSeconds < 10) {
        totalSeconds = `0${totalSeconds}`;
    }
    return `${hours}:${minutes}:${totalSeconds}`;
};

// 비디오 현재 진행 시간을 구하는 함수
function getCurrentTime() {
    currentTime.innerHTML = formatDate(Math.ceil(videoPlayer.currentTime));
}

// 비디오 총 시간을 구하는 함수
async function setTotalTime() {
    let duration;
    if (!isFinite(videoPlayer.duration)) {
        const blob = await fetch(videoPlayer.src).then((response) =>
            response.blob()
        );
        duration = await getBlobDuration(blob);
        // console.log("if", blob, duration);
    } else {
        duration = videoPlayer.duration;
        // console.log("else", duration);
    }
    const totalTimeString = formatDate(duration);
    totalTime.innerHTML = totalTimeString;
    // setInterval 함수로 1초마다 비디오 현재 진행 시간을 보여줌
    setInterval(getCurrentTime, 1000);
}

// 비디오 재생이 끝나면 발생하는 함수
function handleEnded() {
    registerView();
    videoPlayer.currentTime = 0;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

// Volume을 원하는 곳으로 옮길 때 발생하는 이벤트 함수
function handleVolumeRange(event) {
    const {
        target: { value },
    } = event;
    videoPlayer.volume = value;
    if (value > 0.7) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else if (value > 0.2) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
    } else if (value > 0) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
    } else {
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

// ProgressBar를 원하는 곳으로 클릭 or 드래그 시 발생하는 함수
function handleMobileProgressSeek(event) {
    const seekTotal = parseInt(newProgressBar.offsetWidth, 10);
    const seekX = event.offsetX;
    const seekPercent = 100 * (seekX / seekTotal);
    newFilledBar.style.width = seekPercent;
    const seekMove = (seekPercent / 100) * Math.floor(videoPlayer.duration);
    videoPlayer.currentTime = seekMove;
}

// 작은 화면 or 모바일에서 ProgressBar가 Time Update가 될 때마다 발생하는 함수(시간에 맞게 ProgressBar가 채워짐)
function handleMobileProgress() {
    const max = Math.floor(videoPlayer.duration);
    const current = Math.floor(videoPlayer.currentTime);
    const percent = 100 * (current / max);
    newFilledBar.style.width = `${percent}%`;
}

// Range바를 원하는 곳으로 클릭 or 드래그 시 발생하는 함수
function handleProgressSeek(event) {
    const seekTotal = parseInt(progressBar.offsetWidth, 10);
    const seekX = event.offsetX;
    const seekPercent = 100 * (seekX / seekTotal);
    progressBar.value = seekPercent;
    progressBar.setAttribute("value", seekPercent);
    const seekMove = (seekPercent / 100) * Math.floor(videoPlayer.duration);
    videoPlayer.currentTime = seekMove;
}

// Range바가 Time Update가 될 때마다 발생하는 함수(시간에 맞게 Range바가 채워짐)
function handleProgress() {
    const max = Math.floor(videoPlayer.duration);
    const current = Math.floor(videoPlayer.currentTime);
    const percent = 100 * (current / max);
    progressBar.value = percent;
    progressBar.setAttribute("value", percent);
}

// 화살표 -> 누를 시 발생하는 이벤트
function handleArrowRight(event) {
    if (event.keyCode === 39) {
        const max = Math.floor(videoPlayer.duration);
        videoPlayer.currentTime += 10;
        const current = Math.floor(videoPlayer.currentTime);
        const percent = 100 * (current / max);
        progressBar.value = percent;
        progressBar.setAttribute("value", percent);
    }
}

// 화살표 <- 누를 시 발생하는 이벤트
function handleArrowLeft(event) {
    if (event.keyCode === 37) {
        const max = Math.floor(videoPlayer.duration);
        videoPlayer.currentTime -= 10;
        const current = Math.floor(videoPlayer.currentTime);
        const percent = 100 * (current / max);
        progressBar.value = percent;
        progressBar.setAttribute("value", percent);
    }
}

// Right Btn을 누를 시 발생하는 이벤트
function handleRightBtn() {
    const max = Math.floor(videoPlayer.duration);
    videoPlayer.currentTime += 10;
    const current = Math.floor(videoPlayer.currentTime);
    const percent = 100 * (current / max);
    progressBar.value = percent;
    progressBar.setAttribute("value", percent);
}

// Left Btn을 누를 시 발생하는 이벤트
function handleLeftBtn() {
    const max = Math.floor(videoPlayer.duration);
    videoPlayer.currentTime -= 10;
    const current = Math.floor(videoPlayer.currentTime);
    const percent = 100 * (current / max);
    progressBar.value = percent;
    progressBar.setAttribute("value", percent);
}

// Video Player에서 마우스가 올라오면 발생하는 함수
function handleMouseOver() {
    document.addEventListener("keydown", handlePlaySpace);
    document.addEventListener("keydown", handleArrowRight);
    document.addEventListener("keydown", handleArrowLeft);
}

// Video Player에서 마우스가 떠나면 발생하는 함수
function handleMouseLeave() {
    document.removeEventListener("keydown", handlePlaySpace);
    document.removeEventListener("keydown", handleArrowRight);
    document.removeEventListener("keydown", handleArrowLeft);
}

function mediaMatch() {
    // Width가 720px이하면 적용되는 자바스크립트 구문
    const mql = window.matchMedia("(max-width:720px)");
    if (mql.matches) {
        // input="range"가 작은 화면에선 작동하지 못하는 현상을 발견
        // 새로운 progressBar를 만듬
        // 아직도 왜 작동 안하는지 이유를 찾지 못함
        element.removeChild(progressBar);
        newProgressBar.classList.add("videoPlayer__progressBar");
        newProgressBar.id = "jsProgressBarFilled";
        element.prepend(newProgressBar);
        newFilledBar.classList.add("videoPlayer__filledBar");
        newFilledBar.id = "jsFilledBar";
        newFilledBar.style.width = 0;
        newProgressBar.prepend(newFilledBar);
        videoPlayer.addEventListener("timeupdate", handleMobileProgress);
        newProgressBar.addEventListener("click", handleMobileProgressSeek);
        newProgressBar.addEventListener("dragover", handleMobileProgressSeek);
        rightBtn.addEventListener("click", handleRightBtn);
        leftBtn.addEventListener("click", handleLeftBtn);
        // Width가 720px 이상이면 적용되는 자바스크립트 구문
    } else {
        videoPlayer.addEventListener("timeupdate", handleProgress);
        progressBar.addEventListener("click", handleProgressSeek);
        progressBar.addEventListener("dragover", handleProgressSeek);
        rightBtn.addEventListener("click", handleRightBtn);
        leftBtn.addEventListener("click", handleLeftBtn);
    }

    // 모바일 Width가 1024px 이하면 발생하는 이벤트
    const mqlTwo = window.matchMedia("(max-device-width:1024px)");
    // input="range"가 모바일에선 작동하지 못하는 현상을 발견
    // 새로운 progressBar를 만듬
    // 아직도 왜 작동 안하는지 이유를 찾지 못함
    if (mqlTwo.matches) {
        videoPlayer.removeEventListener("click", handlePlayClick);
        element.removeChild(progressBar);
        newProgressBar.classList.add("videoPlayer__progressBar");
        newProgressBar.id = "jsProgressBarFilled";
        element.prepend(newProgressBar);
        newFilledBar.classList.add("videoPlayer__filledBar");
        newFilledBar.id = "jsFilledBar";
        newFilledBar.style.width = 0;
        newProgressBar.prepend(newFilledBar);
        videoPlayer.addEventListener("timeupdate", handleMobileProgress);
        newProgressBar.addEventListener("click", handleMobileProgressSeek);
        newProgressBar.addEventListener("dragover", handleMobileProgressSeek);
        rightBtn.addEventListener("click", handleRightBtn);
        leftBtn.addEventListener("click", handleLeftBtn);
    }
}

function init() {
    videoPlayer.volume = 1;
    videoPlayer.addEventListener("play", handleVideoPlayer);
    videoContainer.addEventListener("mouseover", handleMouseOver);
    videoContainer.addEventListener("mouseleave", handleMouseLeave);
    videoPlayer.addEventListener("click", handlePlayClick);
    playBtn.addEventListener("click", handlePlayClick);
    volumeBtn.addEventListener("click", handleVolumeClick);
    fullScreenBtn.addEventListener("click", goFullScreen);
    videoContainer.addEventListener("mousemove", handleMouse);
    videoPlayer.addEventListener("ended", handleEnded);
    volumeRange.addEventListener("input", handleVolumeRange);

    // 배포 후 혹시나 loadedmetadata가 작동 시 발생하는 이벤트
    videoPlayer.addEventListener("loadedmetadata", setTotalTime);
    videoPlayer.addEventListener("loadedmetadata", handleVideoStart);

    // 배포 후 loadedmetadata 이벤트가 작용하지 않음 -> readyState로 해결
    if (videoPlayer.readyState >= 1) {
        setTotalTime();
        handleVideoPlayer();
        handleVideoStart();
    }

    // 모바일에서 적용되는 스크롤바 Media Match
    mediaMatch();
}

if (videoContainer) {
    init();
}