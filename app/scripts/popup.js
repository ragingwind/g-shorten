'use strict';

function showOptions() {
  document.getElementsByClassName('options')[0].style.display = 'block';
}

function copyToClipboard() {
  var url = document.getElementById('url');
  var color = url.style.color;
  var textRange = document.createRange();
  var sel;

  textRange.selectNode(url);
  sel = window.getSelection();
  sel.addRange(textRange);
  document.execCommand("Copy");
  sel.removeAllRanges();

  url.style.color = 'red';
  setTimeout(function() {
    url.style.color = color;
  }, 300);
}

function setAutocopyText(on) {
  on = (on ? 'off' : 'on');
  document.getElementById('autocopy').innerText = 'autocopy is ' + on;
}

document.addEventListener('DOMContentLoaded', function(event) {
  var queryOpts = {currentWindow: true, active: true};
  var port = chrome.runtime.connect({name: "shortern"});
  var setIcon = function(icon, cb) {
    chrome.tabs.query(queryOpts, function(tab) {
      chrome.pageAction.setIcon({
        tabId: tab[0].id,
        path: icon
      }, function() {
        setTimeout(function() {
          cb(tab);
        }, 100);
      });
    });
  };

  port.onMessage.addListener(function(res) {
    setIcon('images/icon-grey-32.png', function(tab) {
      var text = '[{{title}}]({{shortenUrl}})'
               .replace('{{title}}', tab[0].title)
               .replace('{{shortenUrl}}', res.shortUrl);

      document.getElementById('url').innerText = text;
      localforage.getItem('autocopy', function(val) {
        setAutocopyText(val);
        val && copyToClipboard();
        showOptions();
      });
    });
  });

  chrome.tabs.query(queryOpts, function(tab) {
    setIcon('images/icon-color-32.png', function(tab) {
      port.postMessage({url: tab[0].url});
    });
  });

  document.getElementsByClassName('outter')[0].addEventListener("click", function() {
    copyToClipboard();
  });

  document.getElementById('autocopy').addEventListener("click", function() {
    localforage.getItem('autocopy', function(val) {
      val = !val;
      setAutocopyText(val);
      localforage.setItem('autocopy', val);
    });
  });
});
