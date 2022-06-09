function onUseButtonClick(passcard) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        type: PASTE_PASSCARD_TO_FORM,
        data: { passcard }
      }
    );
  });
}

function getPasscardListItem(passcard) {
  const tableRowContainer = document.createElement('tr')

  const tableCellName = document.createElement('td')
  tableCellName.textContent = passcard.name

  const tableCellLogin = document.createElement('td')
  tableCellLogin.textContent = passcard.login

  const tableCellPassword = document.createElement('td')
  tableCellPassword.textContent = "********"

  const tableCellAcceptePasscard = document.createElement('td')
  const button = document.createElement('button')
  button.textContent = 'Использовать'
  button.onclick = function () {
    onUseButtonClick(passcard)
  }

  tableCellAcceptePasscard.appendChild(button)

  tableRowContainer.appendChild(tableCellName)
  tableRowContainer.appendChild(tableCellLogin)
  tableRowContainer.appendChild(tableCellPassword)
  tableRowContainer.appendChild(tableCellAcceptePasscard)

  return tableRowContainer;
}

function show(HtmlElement, isShow) {
  if (isShow) {
    HtmlElement.style.display = 'block';
    return;
  }

  HtmlElement.style.display = 'none';
}

function showLoader(isShow) {
  const loader = document.querySelector('div.loader')
  show(loader, isShow)
}

function showList(isShow) {
  const table = document.querySelector('table.passcard-list')
  show(table, isShow)
}

function setListOfPasscard(passcards) {
  const container = document.querySelector('.passcard-list > tbody');
  const childrens = passcards.map(getPasscardListItem)

  container.replaceChildren(...childrens)
}

document.querySelector('button#options').addEventListener('click', function () {
  openOptionPage()
});

async function getPasscardList() {
  showLoader(true)
  showList(false)
  chrome.runtime.sendMessage({
    type: POPUP_GET_LIST_OF_PASSCARDS
  }, function (passcards) {
    setListOfPasscard(passcards)
    showLoader(false)
    showList(true)
  })
}

async function onLoad(event) {
  getPasscardList()
}

window.addEventListener('load', onLoad)
