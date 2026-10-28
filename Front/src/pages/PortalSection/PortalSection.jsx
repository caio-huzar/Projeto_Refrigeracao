import { useEffect, useState } from 'react'
import { ClipboardList, FileText, History } from 'lucide-react'
import { Link } from 'react-router-dom'
import { listarTecnicos } from '../../services/agendamentoService.js'
import {
  atualizarStatusOrcamento,
  buscarOrdemServico,
  buscarOrcamento,
  buscarTotalOrdemServico,
  listarAgendamentos,
  listarOrcamentos,
  listarOrdensServico,
  listarPecasOrdemServico,
} from '../../services/portalService.js'
import './PortalSection.css'

const sections = {
  chamados: {
    title: 'Meus chamados',
    description: 'Acompanhe suas solicitações, visitas técnicas e ordens de serviço.',
    empty: 'Você ainda não possui chamados ou solicitações.',
    Icon: ClipboardList,
  },
  orcamentos: {
    title: 'Orçamentos',
    description: 'Consulte os valores e aprove ou recuse os orçamentos enviados.',
    empty: 'Você ainda não possui orçamentos para consultar.',
    Icon: FileText,
  },
  historico: {
    title: 'Histórico de serviços',
    description: 'Veja os serviços concluídos pela equipe.',
    empty: 'Você ainda não possui serviços concluídos.',
    Icon: History,
  },
}

const statusNames = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  cancelado: 'Cancelado',
  aberta: 'Aberta',
  agendada: 'Agendada',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
  enviada: 'Enviado',
  enviado: 'Enviado',
  rascunho: 'Em preparação',
  aprovado: 'Aprovado',
  recusado: 'Recusado',
}

function formatDate(value, options = {}) {
  if (!value) return 'Não informado'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Data indisponível'
  return new Intl.DateTimeFormat('pt-BR', options).format(date)
}

function StatusBadge({ status }) {
  const label = statusNames[status] || status || 'Sem status'
  return <span className={`portal-status portal-status--${status || 'unknown'}`}>{label}</span>
}

function RequestCard({ appointment, technicians }) {
  const technician = technicians.find((item) => Number(item.id) === Number(appointment.id_tecnico))
  const [serviceLine, descriptionLine] = (appointment.observacao || '').split('\n')

  return (
    <article className="portal-record">
      <div className="portal-record__top">
        <div>
          <h2>Solicitação #{appointment.id}</h2>
          <p>{serviceLine?.replace(/^Serviço:\s*/, '') || 'Atendimento técnico'}</p>
        </div>
        <StatusBadge status={appointment.status} />
      </div>
      <dl className="portal-record__details">
        <div>
          <dt>Data e horário</dt>
          <dd>{formatDate(appointment.data_hora, { dateStyle: 'short', timeStyle: 'short' })}</dd>
        </div>
        <div>
          <dt>Técnico</dt>
          <dd>{technician?.nome || `Técnico ${appointment.id_tecnico}`}</dd>
        </div>
      </dl>
      {descriptionLine && <p className="portal-record__description">{descriptionLine.replace(/^Descrição:\s*/, '')}</p>}
    </article>
  )
}

function WorkOrderCard({ order, expanded, detail, onToggle, isLoading }) {
  return (
    <article className="portal-record">
      <div className="portal-record__top">
        <div>
          <h2>Chamado #{order.id}</h2>
          <p>{order.servico?.nome || order.eletrodomestico || 'Ordem de serviço'}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <dl className="portal-record__details">
        <div>
          <dt>Aberto em</dt>
          <dd>{formatDate(order.aberta_em, { dateStyle: 'medium' })}</dd>
        </div>
        <div>
          <dt>Data agendada</dt>
          <dd>{formatDate(order.data_agendada, { dateStyle: 'short', timeStyle: 'short' })}</dd>
        </div>
        <div>
          <dt>Técnico</dt>
          <dd>{order.tecnico?.nome || 'A definir'}</dd>
        </div>
      </dl>
      <p className="portal-record__description">{order.descricao_problema}</p>
      <button className="portal-record__action" type="button" onClick={onToggle} disabled={isLoading}>
        {isLoading ? 'Carregando detalhes...' : expanded ? 'Ocultar valores e peças' : 'Ver valores e peças'}
      </button>
      {expanded && detail && (
        <div className="portal-record__extra">
          {detail.order?.eletrodomestico && <p>Equipamento: {detail.order.eletrodomestico}</p>}
          {detail.order?.servico?.nome && <p>Serviço: {detail.order.servico.nome}</p>}
          <p>
            Serviço: {formatCurrency(detail.total?.valor_servico)} · Peças: {formatCurrency(detail.total?.valor_pecas)} ·
            {' '}Total: {formatCurrency(detail.total?.valor_total)}
          </p>
          {detail.parts.length > 0 ? (
            <ul>
              {detail.parts.map((part) => (
                <li key={part.id}>
                  {part.peca?.nome || `Peça ${part.id_peca}`} × {part.quantidade}
                  {' '}({formatCurrency(part.preco_unitario)} cada)
                </li>
              ))}
            </ul>
          ) : <p>Nenhuma peça registrada neste chamado.</p>}
        </div>
      )}
    </article>
  )
}

function formatCurrency(value) {
  if (value === undefined || value === null) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value))
}

function BudgetCard({ budget, detail, onToggle, onStatusChange, isLoading, isUpdating }) {
  const order = detail?.os
  const canRespond = budget.status === 'enviado'

  return (
    <article className="portal-record">
      <div className="portal-record__top">
        <div>
          <h2>Orçamento #{budget.id}</h2>
          <p>Chamado #{budget.id_os}</p>
        </div>
        <StatusBadge status={budget.status} />
      </div>
      <dl className="portal-record__details">
        <div>
          <dt>Valor</dt>
          <dd>{formatCurrency(budget.valor)}</dd>
        </div>
        <div>
          <dt>Validade</dt>
          <dd>{budget.validade ? formatDate(`${budget.validade}T00:00:00`) : 'Não informada'}</dd>
        </div>
        <div>
          <dt>Criado em</dt>
          <dd>{formatDate(budget.criado_em, { dateStyle: 'medium' })}</dd>
        </div>
      </dl>
      <button className="portal-record__action" type="button" onClick={onToggle} disabled={isLoading}>
        {isLoading ? 'Carregando detalhes...' : detail ? 'Ocultar chamado' : 'Ver chamado relacionado'}
      </button>
      {detail && (
        <div className="portal-record__extra">
          <p>{order?.descricao_problema || 'Detalhes da ordem de serviço não disponíveis.'}</p>
          {order?.servico?.nome && <p>Serviço: {order.servico.nome}</p>}
        </div>
      )}
      {canRespond && (
        <div className="portal-record__actions">
          <button type="button" onClick={() => onStatusChange('aprovado')} disabled={isUpdating}>
            {isUpdating ? 'Salvando...' : 'Aprovar orçamento'}
          </button>
          <button type="button" onClick={() => onStatusChange('recusado')} disabled={isUpdating}>
            Recusar
          </button>
        </div>
      )}
    </article>
  )
}

function PortalSection({ section }) {
  const content = sections[section]
  const { Icon } = content
  const [loadedSection, setLoadedSection] = useState(null)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [appointments, setAppointments] = useState([])
  const [orders, setOrders] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [budgets, setBudgets] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [details, setDetails] = useState({})
  const [loadingId, setLoadingId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    let active = true
    let requests

    if (section === 'chamados') {
      requests = Promise.all([listarAgendamentos(), listarOrdensServico(), listarTecnicos()])
        .then(([appointmentData, orderData, technicianData]) => {
          if (!active) return
          setAppointments(appointmentData)
          setOrders(orderData)
          setTechnicians(technicianData)
        })
    } else if (section === 'historico') {
      requests = listarOrdensServico().then((data) => {
        if (active) setOrders(data.filter((order) => order.status === 'concluida'))
      })
    } else {
      requests = listarOrcamentos().then((data) => {
        if (active) setBudgets(data)
      })
    }

    requests
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })
      .finally(() => {
        if (active) setLoadedSection(section)
      })

    return () => { active = false }
  }, [section])

  async function toggleOrderDetails(orderId) {
    if (expandedId === orderId) {
      setExpandedId(null)
      return
    }
    setExpandedId(orderId)
    if (details[orderId]) return

    setLoadingId(orderId)
    setActionError('')
    try {
      const [order, total, parts] = await Promise.all([
        buscarOrdemServico(orderId),
        buscarTotalOrdemServico(orderId),
        listarPecasOrdemServico(orderId),
      ])
      setDetails((current) => ({ ...current, [orderId]: { order, total, parts } }))
    } catch (requestError) {
      setActionError(requestError.message)
    } finally {
      setLoadingId(null)
    }
  }

  async function toggleBudgetDetails(budgetId) {
    if (expandedId === budgetId) {
      setExpandedId(null)
      return
    }
    setExpandedId(budgetId)
    if (details[budgetId]) return

    setLoadingId(budgetId)
    setActionError('')
    try {
      const detail = await buscarOrcamento(budgetId)
      setDetails((current) => ({ ...current, [budgetId]: detail }))
    } catch (requestError) {
      setActionError(requestError.message)
    } finally {
      setLoadingId(null)
    }
  }

  async function respondToBudget(budgetId, status) {
    setUpdatingId(budgetId)
    setActionError('')
    try {
      const updated = await atualizarStatusOrcamento(budgetId, status)
      setBudgets((current) => current.map((budget) => budget.id === budgetId ? updated : budget))
    } catch (requestError) {
      setActionError(requestError.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const records = section === 'orcamentos'
    ? budgets
    : section === 'historico'
      ? orders
      : [...appointments.map((appointment) => ({ type: 'appointment', data: appointment })),
        ...orders.map((order) => ({ type: 'order', data: order }))]
        .sort((left, right) => new Date(right.data.data_hora || right.data.aberta_em) - new Date(left.data.data_hora || left.data.aberta_em))
  const isLoading = loadedSection !== section

  return (
    <section className="portal-section" aria-labelledby="portal-section-title">
      <p className="portal-section__eyebrow">PORTAL DO CLIENTE</p>
      <h1 id="portal-section-title">{content.title}</h1>
      <p className="portal-section__description">{content.description}</p>
      {error && <p className="portal-feedback portal-feedback--error" role="alert">{error}</p>}
      {actionError && <p className="portal-feedback portal-feedback--error" role="alert">{actionError}</p>}
      {isLoading ? (
        <p className="portal-feedback" role="status">Carregando informações...</p>
      ) : records.length === 0 ? (
        <div className="portal-empty">
          <span className="portal-empty__icon"><Icon size={23} strokeWidth={1.7} aria-hidden="true" /></span>
          <p>{content.empty}</p>
          <Link className="portal-section__action" to="/portal/solicitar-atendimento">Solicitar atendimento</Link>
        </div>
      ) : (
        <div className="portal-record-list">
          {section === 'orcamentos' && budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              detail={details[budget.id]}
              onToggle={() => toggleBudgetDetails(budget.id)}
              onStatusChange={(status) => respondToBudget(budget.id, status)}
              isLoading={loadingId === budget.id}
              isUpdating={updatingId === budget.id}
            />
          ))}
          {section !== 'orcamentos' && records.map((record) => record.type === 'appointment'
            ? <RequestCard key={`appointment-${record.data.id}`} appointment={record.data} technicians={technicians} />
            : <WorkOrderCard
                key={`order-${record.data.id}`}
                order={record.data}
                expanded={expandedId === record.data.id}
                detail={details[record.data.id]}
                onToggle={() => toggleOrderDetails(record.data.id)}
                isLoading={loadingId === record.data.id}
              />)}
        </div>
      )}
    </section>
  )
}

export default PortalSection
