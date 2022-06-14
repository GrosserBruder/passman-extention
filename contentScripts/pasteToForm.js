function pastePasscardToForm(passcard) {
  const username = document.querySelector("input[name='login']")
  const password = document.querySelector("input[type='password']")

  const eventChange = new Event('input', { bubbles: true })

  if (username) {
    username.value = passcard.login
    username.dispatchEvent(eventChange)
  }
  if (password) {
    password.value = passcard.password
    password.dispatchEvent(eventChange)
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (true) {
    // check messageTypes file
    case request.type === "PASTE_PASSCARD_TO_FORM": {
      pastePasscardToForm(request.data.passcard)
      break;
    }
  }
  return true;
})
