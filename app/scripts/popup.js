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
      var textRange = document.createRange();
      var text = '[{{title}}]({{shortenUrl}})'
               .replace('{{title}}', tab[0].title)
               .replace('{{shortenUrl}}', res.shortUrl);

      var url = document.getElementById('url');
      var sel;

      url.innerText = text;
      textRange.selectNode(url);
      sel = window.getSelection();
      sel.addRange(textRange);
      document.execCommand("Copy");
      sel.removeAllRanges();
    });
  });

  chrome.tabs.query(queryOpts, function(tab) {
    setIcon('images/icon-color-32.png', function(tab) {
      port.postMessage({url: tab[0].url});
    });
  });
});
