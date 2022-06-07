importScripts('./HttpClient.js')

class _Api {
  constructor(baseUrl) {
    this.client = new _HttpClient(baseUrl)
  }

  async getPasscards(search) {
    return this.client.get('passcards', { search: search })
  }

  async login(data) {
    return this.client.post('user/login', data)
  }

  async logout() {
    return this.client.get('user/logout/')
  }

  async profile() {
    return this.client.get('user/current-user/')
  }
}