async function setBadgeText(text) {
  chrome.action.setBadgeText({ text })
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
