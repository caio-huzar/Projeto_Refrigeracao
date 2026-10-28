import { apiRequest } from './apiService.js'

export function listarAgendamentos() {
  return apiRequest('/agendamentos')
}

export function listarOrdensServico() {
  return apiRequest('/os')
}

export function buscarOrdemServico(id) {
  return apiRequest(`/os/${id}`)
}

export function buscarTotalOrdemServico(id) {
  return apiRequest(`/os/${id}/total`)
}

export function listarPecasOrdemServico(id) {
  return apiRequest(`/os/${id}/pecas`)
}

export function listarOrcamentos() {
  return apiRequest('/orcamentos')
}

export function buscarOrcamento(id) {
  return apiRequest(`/orcamentos/${id}`)
}

export function atualizarStatusOrcamento(id, status) {
  return apiRequest(`/orcamentos/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export function listarDadosCliente() {
  return apiRequest('/clientes')
}

export function buscarDadosCliente(id) {
  return apiRequest(`/clientes/${id}`)
}
