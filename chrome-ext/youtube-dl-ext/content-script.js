// This script immediately runs when visiting a youtube url

console.log("Inserting Mister Grumpy's needle...");

let injectMisterGrumpy = () => {
  var grumpyBtn = document.createElement("button");
  grumpyBtn.id = "mister-grumpy-button"
  grumpyBtn.textContent = "Mister Grumpy's button"

  let infoTextNode = document.querySelector("#info-text");
  infoTextNode.parentNode.insertBefore(grumpyBtn, infoTextNode.nextSibling);

};

let id = setInterval(() => {
  let infoTextNode = document.querySelector("#info-text");
  if (infoTextNode) {
    injectMisterGrumpy();
    console.log("Removed Mr. Grumpy's needle!");
    clearInterval(id);
  }
}, 100);
