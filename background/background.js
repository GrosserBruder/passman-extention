importScripts('./Api.js', '../common/messageTypes.js', '../common/openOptionPage.js')

let Api;

function login(login, password) {
  Api.login({ login: login, password: password })
    .then((...x) => {
      console.log(x)
    })
}

function saveServerUrl(serverUrl) {
  chrome.storage.local.set({
    'serverUrl': serverUrl,
  });
}

function getTabInfo(tabId) {
  return Promise.resolve(chrome.tabs.get(tabId))
}

function saveOption(serverUrl) {
  saveServerUrl(serverUrl);
  Api = new _Api(serverUrl)
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (true) {
    case request.type === SAVE_OPTION: {
      const url = request.data.serverUrl;
      // const login = request.data.login;
      // const password = request.data.password;
      // ToDo: сделать прокидывание адреса сервера в Api при запуске расширения
      saveOption(url)
      login(request.data.login, request.data.password)
      break;
    }
  }
})

// chrome.webNavigation.onCompleted.addListener(
//   function (tabId, changeInfo, tab) {
//     console.log(tabId)
//     console.log(changeInfo)
//     console.log(tab)
//     if (changeInfo.url) {
//       // url has changed; do something here

//     }
//   }
// );

chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason !== "update") return;

  saveOption('http://127.0.0.1:5000/api/v1/')
  // openOptionPage();
})

let selectedTabId;

chrome.tabs.onActivated.addListener(function (activeInfo) {
  // console.log(activeInfo);
  selectedTab = activeInfo.tabId
  getTabInfo(activeInfo.tabId)
    .then((x) => console.log(x.url))
})

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // console.log(tabId)
  // console.log(changeInfo)
  // console.log(tab)
  if (tabId === selectedTabId && changeInfo.url) {
    console.log('equal', changeInfo)
  }
})