export function openOptionPage() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('/html/option.html'));
  }
};

export default openOptionPage;