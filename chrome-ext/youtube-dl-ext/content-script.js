// This script immediately runs when visiting a youtube url

const SEARCH_ENDPOINT = "http://localhost:8080/youtube/music/search";
const DOWNLOAD_ENDPOINT = "http://localhost:8080/youtube/music/download";
const MUSIC_NOT_EXIST = "MUSIC_NOT_EXIST";
const MUSIC_EXIST = "MUSIC_EXIST";
const DOWNLOAD_FAIL = "DOWNLOAD_FAIL";
const DOWNLOAD_SUCCESS = "DOWNLOAD_SUCCESS";
const URL = location.href;

var grumpyBtn = null;
var searchStatus = null; 
let clearBtnStatus = () => {
  if (grumpyBtn) {
    grumpyBtn.classList.remove("okay-status", "not-okay-status", "unknown-status");
  }
};
let updateBtnStatus = () => {
  clearBtnStatus();
  if (grumpyBtn) {
    if (searchStatus) {
      if (searchStatus.status == MUSIC_NOT_EXIST) {
        grumpyBtn.textContent = "Mister Grumpy Download";
        grumpyBtn.classList.add("not-okay-status");
      }
      else if (searchStatus.status == MUSIC_EXIST) {
        grumpyBtn.textContent = "Mister Grumpy";
        grumpyBtn.classList.add("okay-status");
      }
    }
    else {
      grumpyBtn.textContent = "Mister Grumpy idk";
      grumpyBtn.classList.add("unknown-status");
    }
  }
};

let setDownloadingStatus = (downloading) => {
  if (downloading) {
    grumpyBtn.textContent = "Downloading...";
  } 
}

let fetchSearchMusicVideo = () => {
  console.log("Searching for " + URL);
  fetch(SEARCH_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      "url": URL
    })
  })
    .then(resp => {
      return resp.json();
    })
    .then(result => {
      searchStatus = result;
      console.log("searchStatus=");
      console.log(searchStatus);
      updateBtnStatus();
    })
    .catch(err => {
      console.log("error");
      console.log(err);
    })
};
fetchSearchMusicVideo();

var downloadStatus = null;
let fetchDownloadMusicVideo = () => {
  console.log("Downloading for " + URL);
  setDownloadingStatus(true);
  fetch(DOWNLOAD_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      "url": URL
    })
  })
    .then(resp => {
      return resp.json();
    })
    .then(result => {
      downloadStatus = result;
      setDownloadingStatus(false);
      fetchSearchMusicVideo(); // Another to confirm the file exists
    })
    .catch(err => {
      console.log("error");
      console.log(err);
    })
}

let injectMisterGrumpy = () => {
  grumpyBtn = document.createElement("button");
  grumpyBtn.id = "mister-grumpy-button"
  grumpyBtn.classList.add("grumpy-button");
  grumpyBtn.textContent = "Mister Grumpy's button"
  grumpyBtn.onclick = fetchDownloadMusicVideo;

  let infoTextNode = document.querySelector("#info-text");
  infoTextNode.parentNode.insertBefore(grumpyBtn, infoTextNode.nextSibling);
  
  updateBtnStatus();
};

let id = setInterval(() => {
  let infoTextNode = document.querySelector("#info-text");
  if (infoTextNode) {
    console.log("Inserting Mister Grumpy's needle...");
    injectMisterGrumpy();
    console.log("Removed Mr. Grumpy's needle!");
    clearInterval(id);
  }
}, 100);
