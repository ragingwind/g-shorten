'use strict';

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'loading') {
    chrome.pageAction.show(tabId);
  }
});

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    var http = new XMLHttpRequest();
    var url = "https://www.googleapis.com/urlshortener/v1/url";
    var params = '{"longUrl": "' + msg.url + '"}';

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");

    http.onreadystatechange = function() {
      if (http.readyState == 4) {
        port.postMessage({
          shortUrl: http.status === 200 ? JSON.parse(http.responseText).id : 'We got failed to make shorten URL'
        });
      }
    }
    http.send(params);
  });
});
