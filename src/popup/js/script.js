const searchForTranslate = () => {
  const textToTranslate = document.getElementById('ni-input').value;
  openTab(`https://translate.google.com/#en/auto/${encodeURIComponent(textToTranslate)}`);
  return false;
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('ni-submit').onclick = () => {
    searchForTranslate();
  };
  document.getElementById('ni-input').addEventListener('keypress', (event) => {
    try {
      if (event.keyCode === 13) {
        searchForTranslate();
      }
    } catch (e) {
      console.log(e);
    }
    return true;
  });
});

function openTab(url) {
  chrome.tabs.query({}, (tabs) => {
    let tabId = false;
    for (let i = 0; i < tabs.length; i += 1) {
      if (tabs[i].url.indexOf('translate.google.com') > 0) {
        tabId = tabs[i].id;
      }
    }
    if (tabId) {
      chrome.tabs.update(tabId, { url, active: true });
    } else {
      chrome.tabs.create({ url });
    }
    window.close();
  });
}
