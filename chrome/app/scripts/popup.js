'use strict';

var linkTextFormats = [
  '[{{title}}]({{shortenUrl}})',
  '{{title}} - {{shortenUrl}}',
  '{{title}}, {{shortenUrl}}',
  '{{title}} / {{shortenUrl}}',
  '{{title}}: {{shortenUrl}}',
  '{{shortenUrl}}'
];

var linkInfo = {
  title: '',
  longUrl: '',
  shortenUrl: '',
  textFormat: 0,
  autocopy: true,
};

var selectedShorten = 0;

function showOptions() {
  document.getElementsByClassName('options')[0].style.display = 'block';
}

function copyToClipboard(idx) {
  idx = !idx ? 0 : idx;

  var url = document.querySelectorAll('.shortenUrl')[idx];
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

function updateAutocopyText() {
  document.getElementById('autocopy').innerText = 'autocopy is ' + (linkInfo.autocopy ? 'on' : 'off');
}

function updateLinkText(selectedText) {
  linkTextFormats.forEach((format, idx) => {
    var text = format.replace('{{title}}', selectedText || linkInfo.title)
        .replace('{{shortenUrl}}', linkInfo.shortenUrl);
    var div = document.createElement('div');
    div.className = 'shortenUrl';
    div.style.cursor = 'pointer';
    div.style.paddingBottom = '5px';
    div.textContent = `${text}`;
    div.addEventListener('click', () => {
      copyToClipboard(idx);
    });

    document.getElementById('url').appendChild(div);
  });
}

document.addEventListener('DOMContentLoaded', function(event) {
  var queryOpts = {currentWindow: true, active: true};
  var port = chrome.runtime.connect({name: "shortern"});

  port.onMessage.addListener(function(res) {
    linkInfo.shortenUrl = res.shortUrl;
    updateLinkText(res.selectedText);
    updateAutocopyText();
    showOptions();
    if (linkInfo.autocopy) {
      copyToClipboard();
    }
  });

  // Bind event for autocopy
  document.getElementById('autocopy').addEventListener("click", function() {
    linkInfo.autocopy = !linkInfo.autocopy;
    // localforage.setItem('autocopy', linkInfo.autocopy);
    updateAutocopyText();
  });

  // Bind event for changing format
  // document.getElementById('format').addEventListener("click", function() {
  //   if (linkInfo.textFormat + 1 >= linkTextFormats.length) {
  //     linkInfo.textFormat = 0;
  //   } else {
  //     linkInfo.textFormat++;
  //   }
  //   // localforage.setItem('format', linkInfo.textFormat);
  //   updateLinkText();
  //   copyToClipboard();
  // });

  // Load link.textFormat index
  // localforage.getItem('format', function(err, val) {
  //   linkInfo.textFormat = val === null ? 0 : val;
  // });

  // localforage.getItem('autocopy', function(err, val) {
  //   linkInfo.autocopy = val === null ? false : val;
  // });

  // Query current activated tab info then request longUrl making shorten
  chrome.tabs.query(queryOpts, function(tab) {
    linkInfo.title = tab[0].title;
    linkInfo.longUrl = tab[0].url;
    port.postMessage({url: linkInfo.longUrl});
  });
});
