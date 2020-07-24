const nikitos = window.nikitos || {};

nikitos.popupWindow = undefined;

nikitos.keydown = (k) => {
  const oEvent = document.createEvent('KeyboardEvent');
  // Chromium Hack
  Object.defineProperty(oEvent, 'keyCode', {
    get() {
      return this.keyCodeVal;
    },
  });
  Object.defineProperty(oEvent, 'which', {
    get() {
      return this.keyCodeVal;
    },
  });
  if (oEvent.initKeyboardEvent) {
    oEvent.initKeyboardEvent('keydown', true, true, document.defaultView, false, false, false, false, k, k);
  } else {
    oEvent.initKeyEvent('keydown', true, true, document.defaultView, false, false, false, false, k, 0);
  }
  oEvent.keyCodeVal = k;
  if (oEvent.keyCode !== k) {
    console.log(`nikitos: keyCode mismatch ${oEvent.keyCode}(${oEvent.which})`);
  }
  document.dispatchEvent(oEvent);
};

nikitos.mutationObserver = new MutationObserver((mutations) => {
  // look through all mutations that just occured
  for (let i = 0; i < mutations.length; i += 1) {
    // look through all added nodes of this mutation
    for (let j = 0; j < mutations[i].addedNodes.length; j += 1) {
      // was a child added with ID of 'bar'?
      // if(mutations[i].addedNodes[j].id == "bar") {
      for (let l = 0; l < mutations[i].addedNodes[j].childNodes.length; l += 1) {
        const text = mutations[i].addedNodes[j].childNodes[l].innerHTML;
        // console.log('mutations[i].addedNodes[j]->',mutations[i].addedNodes[j].childNodes[0]);
        const textArr = text.split(' ');
        mutations[i].addedNodes[j].childNodes[l].innerText = '';

        for (let k = 0; k < textArr.length; k += 1) {
          // newText = '<i style="font-style: normal;" class="toTranslate">' + textArr[k] + '</i>'

          if (textArr[k].substring(0, 3) === '<br') {
            const br = document.createElement('br');
            mutations[i].addedNodes[j].childNodes[l].appendChild(br);
          }

          const elem = document.createElement('i');
          elem.style.fontStyle = 'normal';
          elem.style.color = '#ffffff';
          elem.className = 'toTranslate';
          const word = document.createTextNode(textArr[k].replace(/(<([^>]+)>)/ig, ''));
          elem.appendChild(word);
          mutations[i].addedNodes[j].childNodes[l].appendChild(elem);

          const elem2 = document.createElement('i');
          elem2.style.fontStyle = 'normal';
          elem2.style.color = '#ffffff';
          const word2 = document.createTextNode(' ');
          elem.appendChild(word2);
          mutations[i].addedNodes[j].childNodes[l].appendChild(elem2);
        }
      }
      // console.log('*****>',mutations[i].addedNodes[j].childNodes[0].childNodes[0]);
      // mutations[i].addedNodes[j].childNodes[0].childNodes[0].nodeValue = newText;
      // console.log( mutations[i].addedNodes[j].innerHTML);
      // }
    }
  }
});

nikitos.initTranslator = () => {
  nikitos.mutationObserver.observe(document.getElementsByClassName('player-timedtext')[0], { childList: true });
};

nikitos.initRewindButton = () => {
  const rewindButton = document.createElement('div');
  rewindButton.className = 'player-control-button';
  rewindButton.className += ' nfp-rewindButton';
  rewindButton.className += ' icon-player-rewind10';
  nikitos.insertAfter(rewindButton, document.getElementsByClassName('player-play-pause')[0]);
  document.getElementsByClassName('icon-player-rewind10')[0].onclick = () => {
    nikitos.keydown(37);
    setTimeout(() => {
      if (document.getElementsByClassName('play')[0]) document.getElementsByClassName('play')[0].click();
    }, 300);
  };
};

nikitos.insertAfter = (newElement, targetElement) => {
  const parent = targetElement.parentNode;
  if (parent.lastchild === targetElement) {
    parent.appendChild(newElement);
  } else {
    parent.insertBefore(newElement, targetElement.nextSibling);
  }
};

nikitos.hasClass = (element, cls) => (` ${element.className} `).indexOf(` ${cls} `) > -1;

document.body.addEventListener('click', (evt) => {
  if (evt.target.className === 'toTranslate') { // player-timedtext
    if (document.getElementsByClassName('pause')[0]) document.getElementsByClassName('pause')[0].click();
    const textToTranslate = evt.target.innerText;
    // var script = document.createElement('script');
    // script.src = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20160117T161042Z.b5048bbb8cfc522c.aedbcfcfccc0601afa19175303208a1cdbe8d828&lang=en-ru&text='+ encodeURIComponent(textToTranslate) +  '&callback=foo&#8221';
    // document.getElementsByTagName('head')[0].appendChild(script);
    // window.open('https://translate.google.com/#en/auto/' + evt.target.innerText,'_blank');
    // var url = 'https://translate.google.com/?LearningEnglishWithNetflix#en/auto/' + encodeURIComponent(textToTranslate);
    const url = `https://translate.google.com/#en/auto/${encodeURIComponent(textToTranslate)}`;
    if (nikitos.popupWindow && nikitos.popupWindow.opener !== null) {
      nikitos.popupWindow.location.href = url;
    } else {
      nikitos.popupWindow = window.open(url, '_blank', 'toolbar=no, scrollbars=yes, resizable=yes');
    }
    nikitos.popupWindow.focus();
  }
}, false);

document.addEventListener('DOMNodeInserted', (a) => {
  if (nikitos.hasClass(a.target, 'player-play-pause')) {
    nikitos.initRewindButton();
    nikitos.initTranslator();
  }
}, false);
