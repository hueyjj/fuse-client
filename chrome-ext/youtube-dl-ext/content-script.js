// This script immediately runs when visiting a youtube url


/////////////////////////////////////////////////////////////////////////////////////////
// Third party
/////////////////////////////////////////////////////////////////////////////////////////
/**
* Get YouTube ID from various YouTube URL
* @author: takien
* @url: http://takien.com
* For PHP YouTube parser, go here http://takien.com/864
*/
function YouTubeGetID(url) {
  var ID = '';
  url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if (url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    ID = ID[0];
  }
  else {
    return null;
  }
  return ID;
}
/////////////////////////////////////////////////////////////////////////////////////////

const SEARCH_ENDPOINT = "http://localhost:8080/youtube/music/search";
const DOWNLOAD_ENDPOINT = "http://localhost:8080/youtube/music/download";
const MUSIC_NOT_EXIST = "MUSIC_NOT_EXIST";
const MUSIC_EXIST = "MUSIC_EXIST";
const DOWNLOAD_FAIL = "DOWNLOAD_FAIL";
const DOWNLOAD_SUCCESS = "DOWNLOAD_SUCCESS";
let URL = null;

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

let setUrl = () => {
  let id = YouTubeGetID(location.href);
  if (id) {
    URL = "https://www.youtube.com/watch?v=" + id;
  } else {
    URL = null;
  }
}
setUrl();

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

window.addEventListener("yt-navigate-finish", () => {
  // Reset
  setUrl();
  searchStatus = null;
  updateBtnStatus();
  fetchSearchMusicVideo();
})



