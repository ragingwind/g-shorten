'use strict';

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
          cb(tab)
        }, 100);
      });
    });
  };

  port.onMessage.addListener(function(res) {
    setIcon('images/icon-grey-32.png', function(tab) {
      var text = '[{{title}}]({{shortenUrl}})'
               .replace('{{title}}', tab[0].title)
               .replace('{{shortenUrl}}', res.shortUrl);

      document.getElementById('url').innerText = text;;
    });
  });

  chrome.tabs.query(queryOpts, function(tab) {
    setIcon('images/icon-color-32.png', function(tab) {
      port.postMessage({url: tab[0].url});
    });
  });

  document.getElementsByClassName('outter')[0].addEventListener("click", function() {
    var textRange = document.createRange();
    var url = document.getElementById('url');
    var sel;

    textRange.selectNode(url);
    sel = window.getSelection();
    sel.addRange(textRange);
    document.execCommand("Copy");
    sel.removeAllRanges();

    var color = url.style.color;
    url.style.color = 'red';

    setTimeout(function() {
      url.style.color = color;
    }, 300);
  });
});
