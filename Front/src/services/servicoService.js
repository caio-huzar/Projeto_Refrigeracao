import { apiRequest } from './apiService.js'

export async function listarServicos() {
  return apiRequest('/servicos')
}