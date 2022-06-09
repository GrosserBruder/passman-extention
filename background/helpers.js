async function setBadgeText(text) {
  chrome.action.setBadgeText({ text: 'Загрузка' })
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
    // throw new Error("url is not correct");
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    // return Promise.reject('url is not find http or https protocol');
  }

  return chrome.storage.local.set({
    'selectedUrl': parsedUrl.host,
  }).then(function () {
    return parsedUrl.host;
  });
}
