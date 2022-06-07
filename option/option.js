function save_options() {
  var serverUrl = document.getElementById('serverUrl').value;
  var login = document.getElementById('login').value;
  var password = document.getElementById('password').value;

  chrome.runtime.sendMessage({
    type: SAVE_OPTION,
    data: {
      serverUrl, login, password
    }
  }, function (response) {
    if (response.result === "success") {
      console.log("success")
    }
    if (response.result === "error") {
      console.log("error")
    }
  })
}

function initial() {
  chrome.storage.local.get('serverUrl', function (x) {
    document.getElementById('serverUrl').value = x.serverUrl;
  })
}

document.getElementById('save').addEventListener('click', save_options);

window.addEventListener('load', initial)