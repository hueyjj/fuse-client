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
let shouldReplay = false;

let replayBtn = null;

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
  replayBtn = document.createElement("button");
  replayBtn.id = "23958h2-replay-button";
  replayBtn.classList.add("hueyjj-replay-button");
  replayBtn.onclick = () => {
    if (shouldReplay) {
      replayBtn.classList.remove("replay-enable");
      replayBtn.classList.add("replay-disable");
      shouldReplay = false;
    } else {
      replayBtn.classList.remove("replay-disable");
      replayBtn.classList.add("replay-enable");
      shouldReplay = true;
    }
  }

  let replaySvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  replaySvg.width = "100%";
  replaySvg.height = "100%";
  replaySvg.setAttribute("viewBox", "0 0 36 36");
  let replayPathSvg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  replayPathSvg.classList.add("replay-path-svg");
  replayPathSvg.setAttribute("d", "M 18,11 V 7 l -5,5 5,5 v -4 c 3.3,0 6,2.7 6,6 0,3.3 -2.7,6 -6,6 -3.3,0 -6,-2.7 -6,-6 h -2 c 0,4.4 3.6,8 8,8 4.4,0 8,-3.6 8,-8 0,-4.4 -3.6,-8 -8,-8 z");

  replaySvg.appendChild(replayPathSvg);
  replayBtn.appendChild(replaySvg);

  let infoTextNode = document.querySelector("#info-text");
  infoTextNode.parentNode.insertBefore(replayBtn, infoTextNode.nextSibling);

  grumpyBtn = document.createElement("button");
  grumpyBtn.id = "mister-grumpy-button";
  grumpyBtn.classList.add("grumpy-button");
  grumpyBtn.textContent = "Mister Grumpy's button";
  grumpyBtn.onclick = fetchDownloadMusicVideo;

  infoTextNode.parentNode.insertBefore(grumpyBtn, infoTextNode.nextSibling);

  updateBtnStatus();
};

let id = setInterval(() => {
  let infoTextNode = document.querySelector("#info-text");
  if (infoTextNode) {
    console.log("Inserting Mister Grumpy's needle...");
    injectMisterGrumpy();
    console.log("Removed Mr. Grumpy's needle!");
  }

  let playButton = document.querySelector(".ytp-play-button");
  if (playButton) {
    let config = { attributes: true };
    let callback = (mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type == "attributes"
          && mutation.target.title.toLowerCase() == "replay"
          && shouldReplay) {
            mutation.target.click();
        }
      }
    }
    let observer = new MutationObserver(callback);
    observer.observe(playButton, config);
  }

  if (infoTextNode && playButton) {
    clearInterval(id);
  }
}, 100);

window.addEventListener("yt-navigate-finish", () => {
  // Reset
  setUrl();
  searchStatus = null;
  updateBtnStatus();
  fetchSearchMusicVideo();
  shoudReplay = false;
})



