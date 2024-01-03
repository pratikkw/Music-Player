"use strict";

const body = document.body;
const overlay = document.querySelector(".overlay");
const preloader = document.querySelector(".preloader");
const preloaderImg = document.querySelector(".preloader img");
const playlistArea = document.querySelector(".playlist__box");
const songLists = document.querySelector(".lists");
const playlistCloseBtn = document.querySelector(".close");

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
const play_pauseSpan = document.getElementById("play_btn");
const skipNext = document.getElementById("forward");
const skipPrev = document.getElementById("previous");
const loopBtn = document.getElementById("loop");
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
        ${item.artiest} <span>&centerdot; 3:45</span>
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
  play_pauseSpan.innerText = "pause";
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
  if (btnPlay.innerText === "play_arrow") {
    btnPlay.innerText = "pause";
  } else if (btnPlay.innerText === "pause") {
    btnPlay.innerText = "play_arrow";
  }
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
  const min = Math.trunc(songDura / 60);
  const sec = Math.trunc(songDura % 60);

  // Total Duration:-
  if (isNaN(min) || isNaN(sec)) {
    totalDuration.textContent = `0:00`;
  } else {
    totalDuration.textContent = `${min}:${sec > 10 ? sec : "0" + sec}`;
  }

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
  play_pauseSpan.innerText = "pause";
});
// -------------------------------

// --> SELECT MUSIC FROM LISTs
songLists.addEventListener("click", function (e) {
  const item = e.target.closest(".list");
  if (!item) return;

  if (item.dataset.id === currentSong && audioBox.paused === false) {
    audioBox.pause();
    play_pauseSpan.innerText = "play_arrow";
    startandstopLists();
  } else if (item.dataset.id === currentSong && audioBox.paused === true) {
    audioBox.play();
    play_pauseSpan.innerText = "pause";
    startandstopLists();
  } else {
    currentSong = item.dataset.id;
    setupSong(currentSong);
    highlightItem(currentSong);
    audioBox.play();
    play_pauseSpan.innerText = "pause";
  }
  playlistArea.classList.toggle("playlist__box--active");
});
// -------------------------------

playlistBtn.addEventListener("click", openPlaylist);
playlistCloseBtn.addEventListener("click", openPlaylist);
overlay.addEventListener("click", openPlaylist);

play_pauseBtn.addEventListener("click", function (e) {
  play_puase_Logic(e.target);
  highlightItem(currentSong);
  startandstopLists();
});

skipNext.addEventListener("click", function () {
  currentSong++;
  currentSong = currentSong === maxLeng ? 0 : currentSong;
  skip();
  highlightItem(currentSong);
});

skipPrev.addEventListener("click", function () {
  currentSong--;
  currentSong = currentSong < 0 ? maxLeng - 1 : currentSong;
  skip();
  highlightItem(currentSong);
});
