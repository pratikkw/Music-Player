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
const play_pauseBtn = document.getElementById("start_stop");
const play_pauseSpan = document.getElementById("play_btn");
const skipNext = document.getElementById("forward");
const skipPrev = document.getElementById("previous");
const loopBtn = document.getElementById("loop");
const playlistBtn = document.getElementById("playlist");

let allSong;
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

// DURATION
const durationLogic = function () {};
// -------------------------------

window.addEventListener("load", function () {
  preloaderImg.src = "";
  preloaderImg.alt = "";
  preloader.classList.add("preloader--deactivate");
});

audioBox.addEventListener("timeupdate", function (e) {
  const songDura = e.target.duration;
  const min = Math.trunc(songDura / 60);
  const sec = Math.trunc(songDura % 60);

  totalDuration.textContent = `${min > 10 ? min : "0" + min}: ${
    sec > 10 ? sec : "0" + sec
  }`;

  currentsongTime.textContent = Math.trunc(e.target.currentTime);
});

playlistBtn.addEventListener("click", openPlaylist);
playlistCloseBtn.addEventListener("click", openPlaylist);
overlay.addEventListener("click", openPlaylist);

play_pauseBtn.addEventListener("click", function (e) {
  play_puase_Logic(e.target);
  durationLogic();
});

skipNext.addEventListener("click", function () {
  currentSong++;
  currentSong = currentSong === maxLeng ? 0 : currentSong;
  skip();
});

skipPrev.addEventListener("click", function () {
  currentSong--;
  currentSong = currentSong < 0 ? maxLeng - 1 : currentSong;
  skip();
});
