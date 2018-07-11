
document.addEventListener('DOMContentLoaded', () => {
    // Close tab when after magnet link has opened
    chrome.tabs.onCreated.addListener(function(tab) {
        chrome.tabs.remove(tab.id);
    });
   
});
