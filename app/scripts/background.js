'use strict';

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'loading') {
    chrome.pageAction.show(tabId);
  }
});

function insertUrl(url, cb) {
  gapi.client.urlshortener.url.insert({
    'resource': { 'longUrl': url }
  }).execute(cb);

};

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    var postMessage = function(res) {
      port.postMessage({ shortUrl: res.id });
    };

    if (gapi.client.urlshortener) {
      insertUrl(msg.url, postMessage);
    } else {
      gapi.client.load('urlshortener', 'v1', function() {
        insertUrl(msg.url, postMessage);
      });
    }
  });
});
