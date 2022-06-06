function save_options() {
  var serverUrl = document.getElementById('serverUrl').value;
  var login = document.getElementById('login').value;
  var password = document.getElementById('password').value;

  chrome.storage.sync.set({
    serverUrl: serverUrl,
    login: login,
    password: password,
  }
    // , function () {
    // // Update status to let user know options were saved.
    // var status = document.getElementById('status');
    // status.textContent = 'Options saved.';
    // setTimeout(function () {
    //   status.textContent = '';
    // }, 750);
    // }
  );
}

document.getElementById('save').addEventListener('click',
  save_options);