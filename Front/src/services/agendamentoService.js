import { apiRequest } from './apiService.js'

export async function listarTecnicos() {
  return apiRequest('/tecnicos')
}

export async function listarHorariosDisponiveis(idTecnico, diaSemana) {
  const query = new URLSearchParams({
    id_tecnico: idTecnico,
    dia_semana: diaSemana,
    esta_ativo: 'true',
  })
  return apiRequest(`/horarios?${query}`)
}

export async function criarAgendamento(agendamento) {
  return apiRequest('/agendamentos', {
    method: 'POST',
    body: JSON.stringify(agendamento),
  })
}
