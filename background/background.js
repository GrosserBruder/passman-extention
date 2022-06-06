importScripts('./HttpClient.js')

const HttpClient = new _HttpClient();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('request', request);
  console.log('sender', sender);
  console.log('sendResponse', sendResponse);
})