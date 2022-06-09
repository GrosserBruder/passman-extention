importScripts('./Api.js', '../common/messageTypes.js', '../common/openOptionPage.js', './helpers.js')

let Api = new _Api();

function initialApi() {
  getServerUrl()
    .then((url) => Api = new _Api(url))
    .catch(() => Api = new _Api())
}

async function login(login, password) {
  return Api.login({ login: login, password: password })
}

async function getTabInfo(tabId) {
  return chrome.tabs.get(tabId)
}

async function saveOption(request) {
  const url = request.data.serverUrl;
  const userLogin = request.data.login;
  const userPassword = request.data.password;

  await setServerUrl(url)
    .then(function (serverUrl) {
      Api = new _Api(serverUrl)
    })

  return login(userLogin, userPassword)
    .then(function (data) {
      return { result: "success" }
    })
    .catch(function () {
      return { result: "error" }
    })
}

async function getPasscards(selectedUrl) {
  if (!selectedUrl) throw new Error('selectedUrl is undefined');

  setBadgeText('Загрузка')

  return Api.getPasscards(selectedUrl)
    .then(function (passcards) {
      setBadgeText(`${passcards.length}`)
      return passcards
    })
    .catch(function (error) {
      setBadgeText('')
      throw error
    })
}

async function selectedUrlChanged(selectedUrl) {
  return getPasscards(selectedUrl)
}

async function getListOfPasscards() {
  return getSelectedUrl()
    .then(getPasscards)
    .then(function (passcards) {
      return {
        status: 'success',
        data: {
          passcards: passcards
        }
      }
    })
    .catch(function (error) {
      if (error instanceof AuthorisationError) {
        return {
          status: 'error',
          data: {
            message: error.message
          }
        }
      }

      return {
        status: 'error',
        data: {
          message: 'Произошла ошибка'
        }
      }
    })
}

let selectedTabId;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (true) {
    case request.type === SAVE_OPTION: {
      saveOption(request)
        .then((result) => {
          sendResponse(result)
        });
      break;
    }
    case request.type === POPUP_GET_LIST_OF_PASSCARDS: {
      getListOfPasscards()
        .then(sendResponse)
      break;
    }
  }
  return true;
})

chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason !== "update") return;

  setServerUrl('http://10.214.1.247:2050/api/v1/')
  openOptionPage();
})

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
  initialApi();
})

chrome.storage.onChanged.addListener(function (changes, areaName) {
  if (areaName !== 'local') return;

  if (Boolean(changes.selectedUrl)) {
    const selectedUrl = changes.selectedUrl.newValue
    selectedUrlChanged(selectedUrl)
  }
})