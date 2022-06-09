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

function getEmptyListItem() {
  const tableRowContainer = document.createElement('tr')

  const tableCellEmpty = document.createElement('td')
  tableCellEmpty.textContent = "Список пуст"
  tableCellEmpty.colSpan = 4

  tableRowContainer.appendChild(tableCellEmpty)

  return tableRowContainer;
}

function getPasscardList(passcards) {
  if (passcards.length < 1) {
    return [getEmptyListItem()]
  }

  return passcards.map(getPasscardListItem)
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
  const childrens = getPasscardList(passcards)

  container.replaceChildren(...childrens)
}

function setError(error) {
  const container = document.querySelector('div.error')
  console.log(error)

  container.textContent = error
  show(container, true)
}

document.querySelector('button#options').addEventListener('click', function () {
  openOptionPage()
});

async function getPasscards() {
  showLoader(true)
  showList(false)
  chrome.runtime.sendMessage({
    type: POPUP_GET_LIST_OF_PASSCARDS
  }, function (response) {
    showLoader(false)

    if (response.status === 'error') {
      setError(response.data.message)
      return;
    }

    setListOfPasscard(response.data.passcards)
    showList(true)
  })
}

async function onLoad(event) {
  getPasscards()
}

window.addEventListener('load', onLoad)
