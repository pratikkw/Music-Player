"use strict";

const body = document.body;
const overlay = document.querySelector(".overlay");
const preloader = document.querySelector(".preloader");
const preloaderImg = document.querySelector(".preloader img");
const playlistArea = document.querySelector(".playlist__box");
const songLists = document.querySelector(".lists");
const playlistBtn = document.getElementById("playlist");
const playlistCloseBtn = document.querySelector(".close");

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

// --> GET SONGs
const getSongs = async function () {
  const result = await fetch("../JSON/musics.json");
  const { music } = await result.json();
  addSongsToList(music);
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

window.addEventListener("load", function () {
  preloaderImg.src = "";
  preloaderImg.alt = "";
  preloader.classList.add("preloader--deactivate");
});

playlistBtn.addEventListener("click", openPlaylist);
playlistCloseBtn.addEventListener("click", openPlaylist);
overlay.addEventListener("click", openPlaylist);
