importScripts('./Api.js', '../common/messageTypes.js', '../common/openOptionPage.js', './helpers.js')

let Api = new _Api();

function initialApi() {
  getServerUrl()
    .then((url) => Api = new _Api(url))
    .catch(() => Api = new _Api())
}

const savedPasscardsByUrl = new Map();
let isAuthorizationFailed = false;

async function login(login, password) {
  return Api.login({ login: login, password: password })
}

async function getTabInfo(tabId) {
  return chrome.tabs.get(tabId)
}

async function saveOption(data) {
  const url = data.serverUrl;
  const userLogin = data.login;
  const userPassword = data.password;

  await setServerUrl(url)
    .then(function () {
      Api = new _Api(url)
    })

  return login(userLogin, userPassword)
    .then(function (profile) {
      return {
        status: 'success',
        data: {
          profile: profile
        }
      }
    })
    .catch(function () {
      return {
        status: 'error',
        data: {
          message: 'Неверный логин или пароль'
        }
      }
    })
}

async function getPasscards(selectedUrl) {
  if (!selectedUrl) throw new Error('selectedUrl is undefined');

  if (Api.getPasscardsAbortController) {
    Api.getPasscardsAbortController.abort()
  }

  setBadgeText('Загрузка')

  return Api.getPasscards(selectedUrl)
    .then(function (passcards) {
      setBadgeText(`${passcards.length}`)
      if (isAuthorizationFailed) {
        isAuthorizationFailed = false
        setAuthorized()
      }
      return passcards
    })
    .catch(function (error) {
      if (error instanceof AuthorisationError) {
        isAuthorizationFailed = true;
        setNeedAuthorization();
      }
      setBadgeText('')
      throw error
    })
}

async function selectedUrlChanged(selectedUrl) {
  return getPasscards(selectedUrl)
    .then(function (passcards) {
      savedPasscardsByUrl.clear();
      savedPasscardsByUrl.set(selectedUrl, passcards)
    })
}

async function getListOfPasscards() {
  return getSelectedUrl()
    .then(function (selectedUrl) {
      return {
        status: 'success',
        data: {
          passcards: savedPasscardsByUrl.get(selectedUrl)
        }
      }
    })
    .catch(function (error) {
      return {
        status: 'error',
        data: {
          message: 'Произошла ошибка'
        }
      }
    })
}

async function getProfile() {
  return Api.profile()
    .then(function (profile) {
      return {
        status: 'success',
        data: {
          profile: profile
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

async function logout() {
  return Api.logout()
    .catch(function () {
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
      saveOption({
        serverUrl: request.data.serverUrl,
        login: request.data.login,
        password: request.data.password,
      })
        .then(sendResponse);
      break;
    }
    case request.type === POPUP_GET_LIST_OF_PASSCARDS: {
      getListOfPasscards()
        .then(sendResponse)
      break;
    }
    case request.type === GET_PROFILE: {
      getProfile()
        .then(sendResponse)
      break;
    }
    case request.type === LOGOUT: {
      logout()
        .then(sendResponse)
      break;
    }
    case request.type === POPUP_CHECK_AUTHORIZATION: {
      getProfile()
        .then(sendResponse)
      break;
    }
  }
  return true;
})

chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason !== "update") return;

  setServerUrl('http://127.0.0.1:1030/api/v1')
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