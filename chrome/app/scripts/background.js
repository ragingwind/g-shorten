'use strict';

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    var http = new XMLHttpRequest();
    var url = 'http://gshorten.herokuapp.com/shorten?longurl=' + msg.url;

    http.open("GET", url, true);
    http.onreadystatechange = function() {
      if (http.readyState == 4) {
        var res = JSON.parse(http.responseText);
        port.postMessage({
          shortUrl: http.status === 200 ? res.id : res.error.message
        });
      }
    }
    http.send();
  });
});
