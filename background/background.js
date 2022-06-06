importScripts('./HttpClient.js', '../common/messageTypes.js')

const HttpClient = new _HttpClient();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (true) {
    case request.type === LOGIN: {
      const url = request.data.serverUrl;
      const login = request.data.login;
      const password = request.data.password;

      console.log(url, login, password)

      HttpClient.post('user/login', { login: login, password: password })
        .then((...x) => {
          console.log(x)
        })
      break;
    }
  }
})