importScripts('./Api.js', '../common/messageTypes.js', '../common/openOptionPage.js')

const Api = new _Api();

function login(login, password) {
  Api.login({ login: login, password: password })
    .then((...x) => {
      console.log(x)
    })
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (true) {
    case request.type === LOGIN: {
      const url = request.data.serverUrl;
      // const login = request.data.login;
      // const password = request.data.password;
      // ToDo: сделать прокидывание адреса сервера в Api при запуске расширения
      login(request.data.login, request.data.password)
      break;
    }
  }
})

chrome.webNavigation.onCompleted.addListener(
  function (tabId, changeInfo, tab) {
    console.log(tabId)
    console.log(changeInfo)
    console.log(tab)
    if (changeInfo.url) {
      // url has changed; do something here

    }
  }
);

chrome.runtime.onInstalled.addListener(function () {
  if (details.reason !== "update") return;

  openOptionPage();
})