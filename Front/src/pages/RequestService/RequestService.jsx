import { useEffect, useState } from 'react'
import { Send } from 'lucide-react'
import { criarAgendamento } from '../../services/agendamentoService.js'
import { listarServicos } from '../../services/servicoService.js'
import './RequestService.css'

const HORARIOS_DISPONIVEIS = [
  '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
  '18:00'
]

function RequestService() {
  const [services, setServices] = useState([])
  const [date, setDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [catalogError, setCatalogError] = useState('')
  const [notice, setNotice] = useState('')
  const [noticeType, setNoticeType] = useState('status')

  const today = new Date()
  const minDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10)

  useEffect(() => {
    let active = true

    listarServicos()
      .then((serviceData) => {
        if (!active) return
        setServices(serviceData)
      })
      .catch((error) => {
        if (active) setCatalogError(error.message)
      })
      .finally(() => {
        if (active) setIsLoadingCatalog(false)
      })

    return () => { active = false }
  }, [])

  function handleDateChange(event) {
    setDate(event.target.value)
  }

  function handleTimeChange(event) {
    setSelectedTime(event.target.value)
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
        data_hora: dataHora.toISOString(),
        observacao: `Serviço: ${serviceName}\nDescrição: ${description}`,
      })
      setNotice('Sua solicitação de atendimento foi enviada com sucesso.')
      setNoticeType('status')
      form.reset()
      setDate('')
      setSelectedTime('')
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
          <select
            name="horario"
            value={selectedTime}
            onChange={handleTimeChange}
            required
          >
            <option disabled value="">
              Selecione um horário...
            </option>
            {HORARIOS_DISPONIVEIS.map((time) => (
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
        {(catalogError || (!isLoadingCatalog && services.length === 0)) && (
          <p className="request-notice" role="alert">
            {catalogError || 'Não há serviços disponíveis no momento.'}
          </p>
        )}
        {notice && <p className={`request-notice request-notice--${noticeType}`} role={noticeType}>{notice}</p>}
        <button
          className="primary-button request-submit"
          type="submit"
          disabled={
            isSubmitting ||
            isLoadingCatalog ||
            Boolean(catalogError) ||
            services.length === 0
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
