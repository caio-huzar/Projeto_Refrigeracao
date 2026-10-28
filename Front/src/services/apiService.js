const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const TOKEN_KEY = 'refrigeracao_access_token'

export function getAccessToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY)
  window.dispatchEvent(new Event('auth-change'))
}

function saveAccessToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token)
  window.dispatchEvent(new Event('auth-change'))
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers)
  const token = getAccessToken()

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  const data = response.status === 204 ? null : await response.json()

  if (response.status === 401 && token) clearSession()
  if (!response.ok) {
    throw new Error(data?.mensagem || data?.error || 'Não foi possível concluir a solicitação.')
  }

  return data
}

export async function login(email, senha) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  })

  if (data?.usuario?.cargo !== 'cliente' || !data.access_token) {
    throw new Error('Este portal é exclusivo para clientes.')
  }

  saveAccessToken(data.access_token)
  return data.usuario
}

export async function cadastrarCliente(usuario, cliente) {
  return apiRequest('/clientes/cadastro', {
    method: 'POST',
    body: JSON.stringify({ usuario, cliente }),
  })
}
