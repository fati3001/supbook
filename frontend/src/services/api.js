/* eslint-disable no-unused-vars */
const API_URL = import.meta.env.VITE_API_URL

const getToken = () => localStorage.getItem('token')

const getUserId = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user).id : null
}

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
})

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error?.error?.message || 'Une erreur est survenue')
  }
  return response.json()
}

export const authService = {
  register: (data) =>
    fetch(`${API_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),

  login: (data) =>
    fetch(`${API_URL}/api/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
}

export const bookService = {
  getAll: () =>
    fetch(`${API_URL}/api/books?populate[0]=author&populate[1]=review&populate[2]=library_collections`, {
      headers: headers(),
    }).then(handleResponse),

  create: (data) =>
    fetch(`${API_URL}/api/books`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ data }),
    }).then(handleResponse),

  update: (id, data) =>
    fetch(`${API_URL}/api/books/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ data }),
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${API_URL}/api/books/${id}`, {
      method: 'DELETE',
      headers: headers(),
    }).then(handleResponse),
}

export const authorService = {
  getAll: () =>
    fetch(`${API_URL}/api/authors`, {
      headers: headers(),
    }).then(handleResponse),

  create: (data) =>
    fetch(`${API_URL}/api/authors`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ data }),
    }).then(handleResponse),
}

export const collectionService = {
  getAll: () =>
    fetch(`${API_URL}/api/library-collections?populate[0]=books`, {
      headers: headers(),
    }).then(handleResponse),

  create: (data) =>
    fetch(`${API_URL}/api/library-collections`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ data }),
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${API_URL}/api/library-collections/${id}`, {
      method: 'DELETE',
      headers: headers(),
    }).then(handleResponse),

  update: (id, data) =>
    fetch(`${API_URL}/api/library-collections/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ data }),
    }).then(handleResponse),
}

export const reviewService = {
  create: (data) =>
    fetch(`${API_URL}/api/reviews`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ data }),
    }).then(handleResponse),

  update: (id, data) =>
    fetch(`${API_URL}/api/reviews/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ data }),
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${API_URL}/api/reviews/${id}`, {
      method: 'DELETE',
      headers: headers(),
    }).then(handleResponse),
}