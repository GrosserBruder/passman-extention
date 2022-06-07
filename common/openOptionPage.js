function openOptionPage() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    // тут не работает callback для sendMessage
    window.open(chrome.runtime.getURL('../option/option.html'));
  }
};