import { useEffect, useState } from 'react'
import { listarDadosCliente } from '../../services/portalService.js'
import './Account.css'

function Account() {
  const [cliente, setCliente] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    listarDadosCliente()
      .then((clientes) => {
        if (active) setCliente(clientes[0] || null)
      })
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => { active = false }
  }, [])

  return (
    <section className="portal-section" aria-labelledby="account-title">
      <p className="portal-section__eyebrow">PORTAL DO CLIENTE</p>
      <h1 id="account-title">Minha conta</h1>
      <p className="portal-section__description">Confira os dados cadastrados no seu perfil.</p>
      {isLoading && <p className="portal-feedback" role="status">Carregando seus dados...</p>}
      {error && <p className="portal-feedback portal-feedback--error" role="alert">{error}</p>}
      {!isLoading && !error && cliente && (
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
      {!isLoading && !error && !cliente && (
        <p className="portal-feedback" role="status">Não foi possível encontrar os dados do cliente.</p>
      )}
    </section>
  )
}

export default Account
