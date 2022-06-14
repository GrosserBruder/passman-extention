importScripts('../common/errors/AuthorisationError.js')

const handleError = response => {
  if (response.redirected) {
    throw new AuthorisationError("Необходимо авторизоваться");
  }
  if (!response.ok) {
    throw Error(response.statusText);
  } else {
    return response.json();
  }
};

class _HttpClient {
  baseUrl

  constructor(baseUrl) {
    this.baseUrl = baseUrl
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
      credentials: 'include',
      ...config,
    })
      .then(handleError)
  }

  async post(url, data, config = {}) {
    return fetch(this.getUrl(url), {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      ...config,
      body: JSON.stringify(data),
    })
      .then(handleError)
  }

  async put(url, data, config = {}) {
    return fetch(this.getUrl(url), {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      ...config,
      body: JSON.stringify(data),
    })
      .then(handleError)
  }

  async delete(url, data, config = {}) {
    return fetch(this.getUrl(url), {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      ...config,
      body: JSON.stringify(data),
    })
      .then(handleError)
  }
}