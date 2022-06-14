async function setBadgeText(text) {
  chrome.action.setBadgeText({ text })
}

async function setNeedAuthorization() {
  setBadgeText('')
  chrome.action.setTitle({ title: 'Требуется авторизация' })
  chrome.action.setIcon({
    path: {
      "16": "/images/error_16.png",
      "32": "/images/error_32.png",
      "48": "/images/error_48.png",
      "128": "/images/error_128.png",
      "192": "/images/error_192.png"
    }
  })
}

async function setAuthorized() {
  chrome.action.setTitle({ title: 'Passman' })
  chrome.action.setIcon({
    path: {
      "16": "/images/logo_16.png",
      "32": "/images/logo_32.png",
      "48": "/images/logo_48.png",
      "128": "/images/logo_128.png",
      "192": "/images/logo_192.png"
    }
  })
}

async function getServerUrl() {
  return chrome.storage.local.get('serverUrl')
}

async function setServerUrl(url) {
  return chrome.storage.local.set({
    'serverUrl': url,
  });
}

async function getSelectedUrl() {
  return chrome.storage.local.get('selectedUrl')
    .then((x) => x.selectedUrl)
}

async function setSelectedUrl(url) {
  let parsedUrl;

  try {
    parsedUrl = new URL(url);
  } catch (e) {
    return false
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return false
  }

  return chrome.storage.local.set({
    'selectedUrl': parsedUrl.host,
  }).then(function () {
    return true
  });
}
