"use strict";

const playlistArea = document.querySelector(".playlist__box");
const playlistBtn = document.getElementById("playlist");
const playlistCloseBtn = document.querySelector(".close");

playlistBtn.addEventListener("click", function () {
  playlistArea.classList.add("playlist__box--active");
});

playlistCloseBtn.addEventListener("click", function () {
  playlistArea.classList.remove("playlist__box--active");
});
