class _HttpClient {
  baseUrl

  constructor(baseUrl) {
    this.baseUrl = baseUrl || 'http://10.214.1.247:2050/api/v1/'
  }

  getUrl(url) {
    return `${this.baseUrl}${url}`
  }

  async get(url, searchParams, config = {}) {
    const urlSearchParams = searchParams ? Object.entries(searchParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')
      : ''
    return fetch(this.getUrl(url + '?' + urlSearchParams), {
      headers: {
        'Content-Type': 'application/json'
      },
      ...config,
    })
      .then((response) => {
        return response.json();
      });
  }

  async post(url, data, config = {}) {
    return fetch(this.getUrl(url), {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      ...config,
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json();
      });
  }

  async put(url, data, config = {}) {
    return fetch(this.getUrl(url), {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      ...config,
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json();
      });
  }

  async delete(url, data, config = {}) {
    return fetch(this.getUrl(url), {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      ...config,
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json();
      });
  }
}