import { useEffect, useState } from 'react'
import { Settings, Check, X } from 'lucide-react'
import { listarDadosCliente, atualizarDadosCliente } from '../../services/portalService.js'
import './Account.css'

function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '')
}

function Account() {
  const [cliente, setCliente] = useState(null)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf_cnpj: '',
    rua: '',
    numero_casa: '',
    bairro: '',
    cep: '',
    cidade: '',
    estado: ''
  })

  useEffect(() => {
    let active = true
    listarDadosCliente()
      .then((clientes) => {
        if (!active) return
        const cli = clientes[0] || null
        setCliente(cli)
        if (cli) {
          setFormData({
            nome: cli.nome || '',
            email: cli.usuario?.email || '',
            telefone: cli.telefone || '',
            cpf_cnpj: cli.cpf_cnpj || '',
            rua: cli.rua || '',
            numero_casa: cli.numero_casa !== undefined ? String(cli.numero_casa) : '',
            bairro: cli.bairro || '',
            cep: cli.cep || '',
            cidade: cli.cidade || '',
            estado: cli.estado || ''
          })
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => { active = false }
  }, [])

  function handleInputChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleToggleEdit() {
    setError('')
    setSuccessMessage('')
    if (isEditing && cliente) {
      setFormData({
        nome: cliente.nome || '',
        email: cliente.usuario?.email || '',
        telefone: cliente.telefone || '',
        cpf_cnpj: cliente.cpf_cnpj || '',
        rua: cliente.rua || '',
        numero_casa: cliente.numero_casa !== undefined ? String(cliente.numero_casa) : '',
        bairro: cliente.bairro || '',
        cep: cliente.cep || '',
        cidade: cliente.cidade || '',
        estado: cliente.estado || ''
      })
    }
    setIsEditing((prev) => !prev)
  }

  async function handleFormSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccessMessage('')

    const telefoneLimpo = onlyDigits(formData.telefone)
    const cpfCnpjLimpo = onlyDigits(formData.cpf_cnpj)
    const cepLimpo = onlyDigits(formData.cep)

    if (![10, 11].includes(telefoneLimpo.length)) {
      setError('Informe um telefone com DDD válido (10 ou 11 dígitos).')
      return
    }
    if (![11, 14].includes(cpfCnpjLimpo.length)) {
      setError('Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.')
      return
    }
    if (cepLimpo.length !== 8) {
      setError('Informe um CEP válido com 8 dígitos.')
      return
    }

    const numeroCasa = Number(formData.numero_casa)
    if (!Number.isInteger(numeroCasa) || numeroCasa < 0) {
      setError('O número deve ser um valor inteiro igual ou maior que zero.')
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        telefone: telefoneLimpo,
        cpf_cnpj: cpfCnpjLimpo,
        rua: formData.rua.trim(),
        numero_casa: numeroCasa,
        bairro: formData.bairro.trim(),
        cep: cepLimpo,
        cidade: formData.cidade.trim(),
        estado: formData.estado.trim()
      }

      const clienteAtualizado = await atualizarDadosCliente(cliente.id, payload)
      setCliente(clienteAtualizado)
      setSuccessMessage('Dados da conta atualizados com sucesso!')
      setIsEditing(false)
    } catch (err) {
      setError(err.message || 'Erro ao atualizar dados da conta.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="portal-section" aria-labelledby="account-title">
      <div className="account-header">
        <div>
          <p className="portal-section__eyebrow">PORTAL DO CLIENTE</p>
          <h1 id="account-title">Minha conta</h1>
          <p className="portal-section__description">
            {isEditing ? 'Atualize as informações do seu perfil abaixo.' : 'Confira os dados cadastrados no seu perfil.'}
          </p>
        </div>
        {!isLoading && cliente && (
          <button
            type="button"
            className={`account-gear-btn ${isEditing ? 'account-gear-btn--active' : ''}`}
            onClick={handleToggleEdit}
            title={isEditing ? 'Cancelar edição' : 'Editar dados da conta'}
            aria-label={isEditing ? 'Cancelar edição' : 'Editar dados da conta'}
          >
            <Settings size={18} className="account-gear-icon" aria-hidden="true" />
            <span>{isEditing ? 'Cancelar' : 'Editar dados'}</span>
          </button>
        )}
      </div>

      {isLoading && <p className="portal-feedback" role="status">Carregando seus dados...</p>}
      {error && <p className="portal-feedback portal-feedback--error" role="alert">{error}</p>}
      {successMessage && <p className="portal-feedback portal-feedback--success" role="status">{successMessage}</p>}

      {!isLoading && cliente && !isEditing && (
        <dl className="account-details">
          <div><dt>Nome</dt><dd>{cliente.nome}</dd></div>
          <div><dt>E-mail</dt><dd>{cliente.usuario?.email || 'Não informado'}</dd></div>
          <div><dt>Telefone</dt><dd>{cliente.telefone}</dd></div>
          <div><dt>CPF/CNPJ</dt><dd>{cliente.cpf_cnpj}</dd></div>
          <div><dt>Endereço</dt><dd>{cliente.rua}, {cliente.numero_casa} - {cliente.bairro}</dd></div>
          <div><dt>Cidade</dt><dd>{cliente.cidade} - {cliente.estado}</dd></div>
          <div><dt>CEP</dt><dd>{cliente.cep}</dd></div>
        </dl>
      )}

      {!isLoading && cliente && isEditing && (
        <form className="account-form" onSubmit={handleFormSubmit}>
          <label className="account-form-field account-form-field--wide">
            <span>Nome completo <b aria-hidden="true">*</b></span>
            <input
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              required
              maxLength={100}
            />
          </label>

          <label className="account-form-field">
            <span>E-mail <b aria-hidden="true">*</b></span>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              maxLength={150}
            />
          </label>

          <label className="account-form-field">
            <span>Telefone (com DDD) <b aria-hidden="true">*</b></span>
            <input
              name="telefone"
              type="tel"
              value={formData.telefone}
              onChange={handleInputChange}
              placeholder="(00) 00000-0000"
              required
              maxLength={15}
            />
          </label>

          <label className="account-form-field">
            <span>CPF ou CNPJ <b aria-hidden="true">*</b></span>
            <input
              name="cpf_cnpj"
              value={formData.cpf_cnpj}
              onChange={handleInputChange}
              placeholder="000.000.000-00"
              required
              maxLength={18}
            />
          </label>

          <label className="account-form-field">
            <span>CEP <b aria-hidden="true">*</b></span>
            <input
              name="cep"
              value={formData.cep}
              onChange={handleInputChange}
              placeholder="00000-000"
              required
              maxLength={9}
            />
          </label>

          <label className="account-form-field account-form-field--wide">
            <span>Rua / Logradouro <b aria-hidden="true">*</b></span>
            <input
              name="rua"
              value={formData.rua}
              onChange={handleInputChange}
              required
              maxLength={100}
            />
          </label>

          <label className="account-form-field">
            <span>Número <b aria-hidden="true">*</b></span>
            <input
              name="numero_casa"
              type="number"
              min="0"
              step="1"
              value={formData.numero_casa}
              onChange={handleInputChange}
              required
            />
          </label>

          <label className="account-form-field">
            <span>Bairro <b aria-hidden="true">*</b></span>
            <input
              name="bairro"
              value={formData.bairro}
              onChange={handleInputChange}
              required
              maxLength={100}
            />
          </label>

          <label className="account-form-field">
            <span>Cidade <b aria-hidden="true">*</b></span>
            <input
              name="cidade"
              value={formData.cidade}
              onChange={handleInputChange}
              required
              maxLength={100}
            />
          </label>

          <label className="account-form-field">
            <span>Estado <b aria-hidden="true">*</b></span>
            <input
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              required
              maxLength={30}
            />
          </label>

          <div className="account-form-actions">
            <button
              type="submit"
              className="primary-button account-save-btn"
              disabled={isSaving}
            >
              <Check size={18} aria-hidden="true" />
              {isSaving ? 'Salvando...' : 'Salvar alterações'}
            </button>
            <button
              type="button"
              className="account-cancel-btn"
              onClick={handleToggleEdit}
              disabled={isSaving}
            >
              <X size={18} aria-hidden="true" />
              Cancelar
            </button>
          </div>
        </form>
      )}

      {!isLoading && !error && !cliente && (
        <p className="portal-feedback" role="status">Não foi possível encontrar os dados do cliente.</p>
      )}
    </section>
  )
}

export default Account
