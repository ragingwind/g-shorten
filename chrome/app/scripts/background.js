'use strict';

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    var http = new XMLHttpRequest();
    var url = "https://www.googleapis.com/urlshortener/v1/url";
    var params = {
      longUrl: msg.url,
      userIp: '182.12.3.1'
    };

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");

    http.onreadystatechange = function() {
      if (http.readyState == 4) {
        var res = JSON.parse(http.responseText);
        port.postMessage({
          shortUrl: http.status === 200 ? res.id : res.error.message
        });
      }
    }
    http.send(JSON.stringify(params));
  });
});
