importScripts('./Api.js', '../common/messageTypes.js', '../common/openOptionPage.js')

let Api = new _Api();

function initialApi() {
  getServerUrl()
    .then((url) => Api = new _Api(url))
    .catch(() => Api = new _Api())
}

async function login(login, password) {
  return Api.login({ login: login, password: password })
}

async function getServerUrl() {
  return chrome.storage.local.get('serverUrl')
}

function saveServerUrl(serverUrl) {
  chrome.storage.local.set({
    'serverUrl': serverUrl,
  });

  Api = new _Api(serverUrl)
}

async function getTabInfo(tabId) {
  return chrome.tabs.get(tabId)
}

function setSelectedUrl(url) {
  const parsedUrl = new URL(url);
  console.log(parsedUrl.host)
}

async function saveOption(request) {
  const url = request.data.serverUrl;
  const userLogin = request.data.login;
  const userPassword = request.data.password;

  saveServerUrl(url)
  return login(userLogin, userPassword)
    .then(function (data) {
      return { result: "success" }
    })
    .catch(function () {
      return { result: "error" }
    })
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (true) {
    case request.type === SAVE_OPTION: {
      saveOption(request)
        .then((result) => {
          sendResponse(result)
        });
      break;
    }
  }
  return true;
})

chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason !== "update") return;

  saveServerUrl('http://10.214.1.247:2050/api/v1/')
  openOptionPage();
})

let selectedTabId;

chrome.tabs.onActivated.addListener(function (activeInfo) {
  selectedTabId = activeInfo.tabId
  getTabInfo(activeInfo.tabId)
    .then((x) => setSelectedUrl(x.url))
})

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tabId === selectedTabId && changeInfo.url) {
    setSelectedUrl(changeInfo.url)
  }
})

chrome.runtime.onStartup.addListener(function () {
  console.log('onStartup')
  initialApi();
})