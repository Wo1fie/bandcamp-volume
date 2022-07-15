const s = document.createElement('script');
s.src = chrome.runtime.getURL('js/bandcamp-volume.js');
(document.head || document.documentElement).appendChild(s);
s.onload = function() {
    s.parentNode.removeChild(s);
};