importScripts('./Api.js', '../common/messageTypes.js')

const Api = new _Api();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (true) {
    case request.type === LOGIN: {
      const url = request.data.serverUrl;
      const login = request.data.login;
      const password = request.data.password;

      console.log(url, login, password)

      Api.login({ login: login, password: password })
        .then((...x) => {
          console.log(x)
        })
      break;
    }
  }
})