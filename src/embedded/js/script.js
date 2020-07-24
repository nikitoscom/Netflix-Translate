const s = document.createElement('script');
// TODO: add "script.js" to web_accessible_resources in manifest.json
s.src = chrome.extension.getURL('src/inject/js/script.js');
s.onload = () => {
  this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(s);
