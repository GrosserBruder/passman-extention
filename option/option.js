function show(HtmlElement, isShow, display) {
  if (isShow) {
    HtmlElement.style.display = display || 'block';

  HtmlElement.style.display = 'none';
}

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
    if (response.status === "success") {
      successAutorization()
      successGetProfile(response.data.profile)
    }
    if (response.status === "error") {
      errorAutorization()
    }
  })
}

async function successGetProfile(userProfile) {
  const fullname = `${userProfile.lastName} ${userProfile.firstName} ${userProfile.patronymicName}`

  const profile = document.querySelector('.profile')
  const profileName = document.querySelector('.profile_name')
  const notAuthorize = document.querySelector('.profile_not_authorize')
  const profileLoading = document.querySelector('.profile_loading')

  profileName.textContent = fullname

  show(profile, true, 'flex')
  show(notAuthorize, false)
  show(profileLoading, false)
}

async function errorGetProfile() {
  const profile = document.querySelector('.profile')
  const profileName = document.querySelector('.profile_name')
  const notAuthorize = document.querySelector('.profile_not_authorize')
  const profileLoading = document.querySelector('.profile_loading')

  profileName.textContent = ''

  show(profile, false)
  show(notAuthorize, true)
  show(profileLoading, false)
}

function getProfile() {
  chrome.runtime.sendMessage({
    type: GET_PROFILE
  }, function (response) {
    if (response.status === "success") {
      successGetProfile(response.data.profile)
    }
    if (response.status === "error") {
      errorGetProfile()
    }
  })
}

function logout() {
  chrome.runtime.sendMessage({
    type: LOGOUT
  }, function (response) {
    if (response.status === "success") {
      errorGetProfile()
    }
  })
}

function initial() {
  chrome.storage.local.get('serverUrl', function (x) {
    document.querySelector("input[name='serverUrl']").value = x.serverUrl;
  })

  getProfile();
}

document.querySelector('form.option_form').addEventListener('submit', save_options);
document.querySelector('.profile_exit a').addEventListener('click', function (event) {
  // event.preventDefault();
  logout()
})

window.addEventListener('load', initial)
