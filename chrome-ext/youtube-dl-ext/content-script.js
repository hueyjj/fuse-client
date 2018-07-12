// This script immediately runs when visiting a youtube url

console.log("Inserting Mister Grumpy's needle...");

let injectMisterGrumpy = () => {
  var grumpyBtn = document.createElement("button");
  grumpyBtn.id = "mister-grumpy-button"
  grumpyBtn.textContent = "Mister Grumpy's button"
  grumpyBtn.onclick = fetchMusicVideoStatus;

  let infoTextNode = document.querySelector("#info-text");
  infoTextNode.parentNode.insertBefore(grumpyBtn, infoTextNode.nextSibling);
};

let fetchMusicVideoStatus = () => {
  fetch("http://localhost:8080/youtube/music/find", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ "url": "foo" })
  })
    .then(resp => {
      return resp.json();
    })
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log("error");
      console.log(err);
    })
};

let id = setInterval(() => {
  let infoTextNode = document.querySelector("#info-text");
  if (infoTextNode) {
    injectMisterGrumpy();
    console.log("Removed Mr. Grumpy's needle!");
    clearInterval(id);
  }
}, 100);
