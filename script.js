"use strict";

const body = document.body;
const overlay = document.querySelector(".overlay");
const preloader = document.querySelector(".preloader");
const preloaderImg = document.querySelector(".preloader img");
const playlistArea = document.querySelector(".playlist__box");
const playlistBtn = document.getElementById("playlist");
const playlistCloseBtn = document.querySelector(".close");

window.addEventListener("load", function () {
  preloaderImg.src = "";
  preloaderImg.alt = "";
  preloader.classList.add("preloader--deactivate");
});

const openPlaylist = function () {
  playlistArea.classList.toggle("playlist__box--active");
  overlay.classList.toggle("overlay--active");
  body.classList.toggle("body-scroll--lock");
};

playlistBtn.addEventListener("click", openPlaylist);
playlistCloseBtn.addEventListener("click", openPlaylist);
overlay.addEventListener("click", openPlaylist);
