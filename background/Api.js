importScripts('./HttpClient.js')

class _Api {
  constructor(baseUrl) {
    this.client = new _HttpClient(baseUrl)
  }

  async getPasscards(search) {
    return this.client.get('passcards', { params: { search } })
      .then((response) => response.data);
  }

  async login(data) {
    return this.client.post('user/login', data)
      .then((response) => response.data);
  }

  async logout() {
    return this.client.get('user/logout/')
      .then((response) => response.data);
  }

  async profile() {
    return this.client.get('user/current-user/')
      .then((response) => response.data);
  }
}