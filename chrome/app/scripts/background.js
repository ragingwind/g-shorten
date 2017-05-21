'use strict';

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    var http = new XMLHttpRequest();
    var url = 'http://gshorten.herokuapp.com/shorten?longurl=' + encodeURIComponent(msg.url);

    http.open("GET", url, true);
    http.onreadystatechange = function() {
      if (http.readyState == 4) {
        var res = JSON.parse(http.responseText);
        chrome.tabs.executeScript( {
          code: "window.getSelection().toString();"
        }, function(selection) {
          port.postMessage({
            shortUrl: http.status === 200 ? res.id : res.error.message,
            selectedText: selection[0]
          });
        });
      }
    }
    http.send();
  });
});
