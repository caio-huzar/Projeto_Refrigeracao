import { useEffect, useState } from 'react'
import { Send } from 'lucide-react'
import {
  criarAgendamento,
  listarHorariosDisponiveis,
  listarTecnicos,
} from '../../services/agendamentoService.js'
import { listarServicos } from '../../services/servicoService.js'
import './RequestService.css'

function gerarHorarios(horarios) {
  const slots = new Set()

  horarios.forEach(({ hora_inicio: inicio, hora_fim: fim, duracao_minutos: duracao }) => {
    const [horaInicio, minutoInicio] = inicio.split(':').map(Number)
    const [horaFim, minutoFim] = fim.split(':').map(Number)
    if (!Number.isFinite(Number(duracao)) || Number(duracao) <= 0) {
      throw new Error('O servidor retornou uma duração de horário inválida.')
    }
    const inicioMinutos = horaInicio * 60 + minutoInicio
    const fimMinutos = horaFim * 60 + minutoFim

    for (let minutos = inicioMinutos; minutos < fimMinutos; minutos += Number(duracao)) {
      const hora = String(Math.floor(minutos / 60)).padStart(2, '0')
      const minuto = String(minutos % 60).padStart(2, '0')
      slots.add(`${hora}:${minuto}`)
    }
  })

  return [...slots].sort()
}

function RequestService() {
  const [services, setServices] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [technicianId, setTechnicianId] = useState('')
  const [date, setDate] = useState('')
  const [timeSlots, setTimeSlots] = useState([])
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [catalogError, setCatalogError] = useState('')
  const [scheduleError, setScheduleError] = useState('')
  const [notice, setNotice] = useState('')
  const [noticeType, setNoticeType] = useState('status')
  const today = new Date()
  const minDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10)

  useEffect(() => {
    let active = true

    Promise.all([listarServicos(), listarTecnicos()])
      .then(([serviceData, technicianData]) => {
        if (!active) return
        setServices(serviceData)
        setTechnicians(technicianData.filter((technician) => technician.esta_ativo !== false))
      })
      .catch((error) => {
        if (active) setCatalogError(error.message)
      })
      .finally(() => {
        if (active) setIsLoadingCatalog(false)
      })

    return () => { active = false }
  }, [])

  useEffect(() => {
    let active = true

    if (!technicianId || !date) return () => { active = false }

    const selectedDate = new Date(`${date}T00:00:00`)

    listarHorariosDisponiveis(technicianId, selectedDate.getDay())
      .then((horarios) => {
        if (active) setTimeSlots(gerarHorarios(horarios))
      })
      .catch((error) => {
        if (active) setScheduleError(error.message)
      })
      .finally(() => {
        if (active) setIsLoadingSlots(false)
      })

    return () => { active = false }
  }, [technicianId, date])

  function handleTechnicianChange(event) {
    const selectedTechnician = event.target.value
    setTechnicianId(selectedTechnician)
    setTimeSlots([])
    setScheduleError('')
    setIsLoadingSlots(Boolean(selectedTechnician && date))
  }

  function handleDateChange(event) {
    const selectedDate = event.target.value
    setDate(selectedDate)
    setTimeSlots([])
    setScheduleError('')
    setIsLoadingSlots(Boolean(selectedDate && technicianId))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setNotice('')
    setIsSubmitting(true)

    const form = event.currentTarget
    const formData = new FormData(form)
    const serviceId = formData.get('servico')
    const serviceName = services.find((service) => String(service.id) === serviceId)?.nome
    const description = formData.get('descricao').trim()
    const dataHora = new Date(`${formData.get('data')}T${formData.get('horario')}:00`)

    try {
      await criarAgendamento({
        id_tecnico: Number(technicianId),
        data_hora: dataHora.toISOString(),
        observacao: `Serviço: ${serviceName}\nDescrição: ${description}`,
      })
      setNotice('Sua solicitação de atendimento foi enviada com sucesso.')
      setNoticeType('status')
      form.reset()
      setTechnicianId('')
      setDate('')
      setTimeSlots([])
    } catch (error) {
      setNotice(error.message)
      setNoticeType('alert')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="request-panel" aria-labelledby="request-title">
      <header className="request-panel__heading">
        <p className="request-panel__eyebrow">ATENDIMENTO TÉCNICO</p>
        <h1 id="request-title">Envie uma mensagem / Solicitar atendimento</h1>
        <p>Agende uma visita técnica domiciliar com a equipe do Jair.</p>
      </header>
      <form className="request-form" onSubmit={handleSubmit}>
        <label className="request-field request-field--wide">
          <span>Tipo de serviço desejado <b aria-hidden="true">*</b></span>
          <select name="servico" defaultValue="" required disabled={isLoadingCatalog || services.length === 0}>
            <option disabled value="">
              {isLoadingCatalog ? 'Carregando serviços...' : 'Selecione o serviço...'}
            </option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>{service.nome}</option>
            ))}
          </select>
        </label>
        <label className="request-field request-field--wide">
          <span>Técnico <b aria-hidden="true">*</b></span>
          <select
            name="tecnico"
            value={technicianId}
            onChange={handleTechnicianChange}
            required
            disabled={isLoadingCatalog || technicians.length === 0}
          >
            <option disabled value="">
              {isLoadingCatalog ? 'Carregando técnicos...' : 'Selecione um técnico...'}
            </option>
            {technicians.map((technician) => (
              <option key={technician.id} value={technician.id}>
                {technician.nome || `Técnico ${technician.id}`}
              </option>
            ))}
          </select>
        </label>
        <label className="request-field">
          <span>Data desejada <b aria-hidden="true">*</b></span>
          <input
            name="data"
            type="date"
            min={minDate}
            value={date}
            onChange={handleDateChange}
            required
          />
        </label>
        <label className="request-field">
          <span>Horário de preferência <b aria-hidden="true">*</b></span>
          <select name="horario" defaultValue="" required disabled={isLoadingSlots || timeSlots.length === 0}>
            <option disabled value="">
              {isLoadingSlots ? 'Carregando horários...' : 'Selecione um horário...'}
            </option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time} - {Number(time.slice(0, 2)) < 12 ? 'Manhã' : 'Tarde'}
              </option>
            ))}
          </select>
        </label>
        <label className="request-field request-field--wide">
          <span>Descrição do problema / equipamento <b aria-hidden="true">*</b></span>
          <textarea
            name="descricao"
            maxLength="770"
            placeholder="Descreva a marca do aparelho e o defeito apresentado (ex.: não gela, faz barulho, está vazando água)..."
            required
            rows="4"
          />
        </label>
        {(catalogError || (!isLoadingCatalog && (services.length === 0 || technicians.length === 0))) && (
          <p className="request-notice" role="alert">
            {catalogError || 'Não há serviços ou técnicos disponíveis no momento.'}
          </p>
        )}
        {scheduleError && <p className="request-notice" role="alert">{scheduleError}</p>}
        {!scheduleError && !isLoadingSlots && technicianId && date && timeSlots.length === 0 && (
          <p className="request-notice" role="status">Não há horários disponíveis para este técnico nesta data.</p>
        )}
        {notice && <p className={`request-notice request-notice--${noticeType}`} role={noticeType}>{notice}</p>}
        <button
          className="primary-button request-submit"
          type="submit"
          disabled={
            isSubmitting ||
            isLoadingCatalog ||
            Boolean(catalogError) ||
            services.length === 0 ||
            technicians.length === 0 ||
            isLoadingSlots ||
            Boolean(technicianId && date && timeSlots.length === 0)
          }
        >
          <Send size={17} aria-hidden="true" />
          {isSubmitting ? 'Enviando solicitação...' : 'Enviar solicitação de atendimento'}
        </button>
      </form>
    </section>
  )
}

export default RequestService
