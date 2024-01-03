"use strict";

const body = document.body;
const overlay = document.querySelector(".overlay");
const preloader = document.querySelector(".preloader");
const preloaderImg = document.querySelector(".preloader img");
const main = document.querySelector(".main");

// PLAYLIST,
const playlistArea = document.querySelector(".playlist__box");
const songLists = document.querySelector(".lists");
const playlistCloseBtn = document.querySelector(".close");

// AUDIO
const audioBox = document.querySelector(".our__audio");

// SELECT IMG, TITLE, ARTIEST
const songImg = document.getElementById("profile__img");
const title = document.querySelector(".primary--title");
const artiest = document.querySelector(".artiest");
const currentsongTime = document.querySelector(".current__time");
const totalDuration = document.querySelector(".total__duration");

// CONTROLs
const progressArea = document.querySelector(".progressArea");
const progressbar = document.querySelector(".progressbar");
const play_pauseBtn = document.getElementById("start_stop");
const play_pauseIcon = document.getElementById("play_btn");
const skipNext = document.getElementById("forward");
const skipPrev = document.getElementById("previous");
const loopBtn = document.getElementById("loop");
const loopIcon = document.getElementById("loop_icon");
const playlistBtn = document.getElementById("playlist");

let allSong;
let countMin = 0;
let currentSong = 0;
let maxLeng;

// --> SETUP SONG
const setupSong = function (num) {
  const ourSong = allSong[num];

  songImg.src = ourSong.img;
  title.textContent = ourSong.title;
  artiest.textContent = ourSong.artiest;
  audioBox.src = ourSong.audio;

  songImg.classList.remove("profile__img--rotate");
};
// -------------------------------

// --> SETUP LIST WITH SONGs
const addSongsToList = function (s) {
  const elements = s
    .map((item, ind) => {
      return `<li class="list flex" data-id=${item.id}>
    <div>
      <img
        class="list__profile img"
        src="${item.img}"
      />
    </div>
    <div class="detail grid">
      <span class="list_songname">${item.title}</span>
      <p class="para flex">
        ${item.artiest} <span>&centerdot; ${item.soungDuration}</span>
      </p>
    </div>
    <span class="material-symbols-outlined list__play">
      play_arrow
    </span>
  </li>`;
    })
    .join("");
  songLists.innerHTML = elements;
};
// -------------------------------

// --> GET SONGs
const getSongs = async function () {
  const result = await fetch("../JSON/musics.json");
  const { music } = await result.json();

  allSong = music;
  maxLeng = music.length;
  addSongsToList(music);
  setupSong(currentSong);
};
getSongs();
// -------------------------------

// --> PLAYLIST OPEN/CLOSE
const openPlaylist = function () {
  playlistArea.classList.toggle("playlist__box--active");
  overlay.classList.toggle("overlay--active");
  body.classList.toggle("body-scroll--lock");
};
// -------------------------------

// --> PLAY/PAUSE LOGIC
const play_puase_Logic = function (element) {
  if (element.innerText === "play_arrow") {
    element.innerText = "pause";
    audioBox.play();
  } else if (element.innerText === "pause") {
    element.innerText = "play_arrow";
    audioBox.pause();
  }
};
// -------------------------------

// --> SKIP
const skip = function () {
  setupSong(currentSong);
  audioBox.play();
  play_pauseIcon.innerText = "pause";
};
// -------------------------------

// --> LOOP LOGIC
const loopLogic = function () {
  loopIcon.innerText =
    loopIcon.innerText === "repeat" ? "repeat_one" : "repeat";
};
// -------------------------------

window.addEventListener("load", function () {
  preloaderImg.src = "";
  preloaderImg.alt = "";
  preloader.classList.add("preloader--deactivate");
});

// --> HIGHLIGHT THE MUSIC IN LISTs
const highlightItem = function (num) {
  const allLists = document.querySelectorAll(".list");

  allLists.forEach((item) => {
    item.style.backgroundColor = "transparent";
    item.querySelector(".list__play").innerText = "play_arrow";
  });

  allLists[num].style.backgroundColor = "#3f3f3f";
  const btnPlay = allLists[num].querySelector(".list__play");
  btnPlay.innerText =
    btnPlay.innerText === "play_arrow" ? "pause" : "play_arrow";
};
// -------------------------------

// --> CHANGE PLAY & PAUSE FOR LISTs
const startandstopLists = function () {
  const allLists = document.querySelectorAll(".list");
  allLists[currentSong].querySelector(".list__play").innerText =
    play_pauseBtn.innerText;
};
// -------------------------------

// --> UPDATE CURRENT TIME & SET TOTAL DURATION
audioBox.addEventListener("timeupdate", function (e) {
  const ct = e.target.currentTime;
  const songDura = e.target.duration;

  // Total Duration:-
  const min = Math.trunc(songDura / 60);
  const sec = Math.trunc(songDura % 60);

  totalDuration.textContent =
    isNaN(min) || isNaN(sec) ? `0:00` : `${min}:${sec > 10 ? sec : "0" + sec}`;

  // Update Current Time:-
  const ctroundup = Math.trunc(e.target.currentTime);
  const ctmin = Math.trunc(ctroundup / 60);
  const ctsec = ctroundup % 60;
  currentsongTime.textContent = `${ctmin}:${ctsec >= 10 ? ctsec : "0" + ctsec}`;

  // ProgressBar:-
  progressbar.style.width = `${(ct / songDura) * 100}%`;
  progressArea.style.setProperty(
    "--progressbar-psedafter-width",
    `${(ct / songDura) * 100}%`
  );

  // Rotating Image
  songImg.style.animationPlayState = audioBox.paused ? "paused" : "running";
});

audioBox.addEventListener("ended", function () {
  if (loopIcon.innerText === "repeat_one") {
    audioBox.play();
  } else {
    currentSong++;
    setupSong(currentSong);
    audioBox.play();
    highlightItem(currentSong);
  }
});
// -------------------------------

// --> SET PROGRESS BAR
progressArea.addEventListener("click", function (e) {
  const dragArea = e.clientX;
  const total_width = this.offsetWidth;

  audioBox.currentTime = (dragArea / total_width) * audioBox.duration;
  progressbar.style.width = `${(dragArea / total_width) * 100}%`;
  progressArea.style.setProperty(
    "--progressbar-psedafter-width",
    `${(dragArea / total_width) * 100}%`
  );
  audioBox.play();
  play_pauseIcon.innerText = "pause";
  highlightItem(currentSong);
});
// -------------------------------

// --> SELECT MUSIC FROM LISTs
songLists.addEventListener("click", function (e) {
  const item = e.target.closest(".list");
  const songNo = Number(item.dataset.id);
  if (!item) return;

  if (songNo === currentSong && audioBox.paused === false) {
    audioBox.pause();
    play_pauseIcon.innerText = "play_arrow";
    startandstopLists();
  } else if (songNo === currentSong && audioBox.paused === true) {
    audioBox.play();
    play_pauseIcon.innerText = "pause";
    startandstopLists();
  } else {
    currentSong = songNo;
    setupSong(currentSong);
    audioBox.play();
    play_pauseIcon.innerText = "pause";
    highlightItem(currentSong);
  }
  playlistArea.classList.remove("playlist__box--active");
  overlay.classList.remove("overlay--active");
  body.classList.remove("body-scroll--lock");
});
// -------------------------------

// PlaylistOpen/Close Button & overlay Button
playlistBtn.addEventListener("click", openPlaylist);
playlistCloseBtn.addEventListener("click", openPlaylist);
overlay.addEventListener("click", openPlaylist);

// Play/Pause Button
play_pauseBtn.addEventListener("click", function (e) {
  play_puase_Logic(e.target);
  highlightItem(currentSong);
  startandstopLists();
});

// Play/Pause Through Space Key
body.addEventListener("keydown", function (e) {
  if (e.key !== " ") return;
  e.preventDefault();
  play_puase_Logic(play_pauseIcon);
  highlightItem(currentSong);
  startandstopLists();
});

// SkipPrev Button
skipNext.addEventListener("click", function () {
  currentSong++;
  currentSong = currentSong === maxLeng ? 0 : currentSong;
  skip();
  highlightItem(currentSong);
});

// SkipPrev Button
skipPrev.addEventListener("click", function () {
  currentSong--;
  currentSong = currentSong < 0 ? maxLeng - 1 : currentSong;
  skip();
  highlightItem(currentSong);
});

// Loop Button
loopBtn.addEventListener("click", loopLogic);

// Rotate Image Button
songImg.addEventListener("dblclick", function () {
  audioBox.paused === false
    ? songImg.classList.toggle("profile__img--rotate")
    : "";
});
