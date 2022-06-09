async function successAutorization() {
  const success = document.querySelector('.authorize.authorize--success')
  const error = document.querySelector('.authorize.authorize--error')

  error.style.display = "none";
  success.style.display = "block";
}

async function errorAutorization() {
  const success = document.querySelector('.authorize.authorize--success')
  const error = document.querySelector('.authorize.authorize--error')

  error.style.display = "block";
  success.style.display = "none";
}

function save_options(event) {
  event.preventDefault();
  const values = new FormData(event.target)

  var serverUrl = values.get('serverUrl');
  var login = values.get('login');
  var password = values.get('password');

  chrome.runtime.sendMessage({
    type: SAVE_OPTION,
    data: {
      serverUrl, login, password
    }
  }, function (response) {
    if (response.result === "success") {
      successAutorization()
    }
    if (response.result === "error") {
      errorAutorization()
    }
  })
}

function initial() {
  chrome.storage.local.get('serverUrl', function (x) {
    document.querySelector("input[name='serverUrl']").value = x.serverUrl;
  })
  document.querySelector("input[name='login']").value = 'Grosser';
  document.querySelector("input[name='password']").value = '123Parol123';
}

document.querySelector('form.option_form').addEventListener('submit', save_options);

window.addEventListener('load', initial)
