function onUseButtonClick(passcard) {
  console.log(passcard)
}

function getPasscardItem(passcard) {
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

function setListOfPasscard(passcards) {
  const container = document.querySelector('.passcard-list > tbody');
  const childrens = passcards.map(getPasscardItem)

  container.replaceChildren(...childrens)
}

document.querySelector('#options').addEventListener('click', function () {
  openOptionPage()
});

chrome.runtime.sendMessage({
  type: POPUP_GET_LIST_OF_PASSCARDS
}, function (passcards) {
  console.log(passcards)
  setListOfPasscard(passcards)
})

