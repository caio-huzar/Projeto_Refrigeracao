import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import Brand from '../../components/Brand/Brand.jsx'
import { cadastrarCliente } from '../../services/apiService.js'
import './Registration.css'

function onlyDigits(value) {
  return value.replace(/\D/g, '')
}

function Registration() {
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registered, setRegistered] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const telefone = onlyDigits(formData.get('telefone'))
    const cpfCnpj = onlyDigits(formData.get('cpf_cnpj'))
    const cep = onlyDigits(formData.get('cep'))

    if (![10, 11].includes(telefone.length)) {
      setMessage('Informe um telefone com DDD, contendo 10 ou 11 dígitos.')
      setIsSubmitting(false)
      return
    }
    if (![11, 14].includes(cpfCnpj.length)) {
      setMessage('Informe um CPF com 11 dígitos ou CNPJ com 14 dígitos.')
      setIsSubmitting(false)
      return
    }
    if (cep.length !== 8) {
      setMessage('Informe um CEP com 8 dígitos.')
      setIsSubmitting(false)
      return
    }

    const usuario = {
      email: formData.get('email').trim(),
      senha: formData.get('senha'),
    }
    const cliente = {
      nome: formData.get('nome').trim(),
      telefone,
      cpf_cnpj: cpfCnpj,
      rua: formData.get('rua').trim(),
      numero_casa: Number(formData.get('numero_casa')),
      bairro: formData.get('bairro').trim(),
      cep,
      cidade: formData.get('cidade').trim(),
      estado: formData.get('estado').trim(),
    }

    try {
      await cadastrarCliente(usuario, cliente)
      setRegistered(true)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-panel registration-panel" aria-labelledby="registration-title">
        <Brand />
        <div className="login-panel__divider" />
        {registered ? (
          <div className="registration-success" role="status">
            <div className="login-heading">
              <p className="login-heading__eyebrow">PORTAL DO CLIENTE</p>
              <h1 id="registration-title">Conta criada!</h1>
              <p>Seu cadastro foi concluído. Agora você já pode acessar o portal.</p>
            </div>
            <Link className="primary-button registration-success__link" to="/login">
              Ir para o login
            </Link>
          </div>
        ) : (
          <>
            <div className="login-heading">
              <p className="login-heading__eyebrow">PORTAL DO CLIENTE</p>
              <h1 id="registration-title">Criar conta</h1>
              <p>Preencha seus dados para acessar o portal do cliente.</p>
            </div>
            <form className="login-form registration-form" onSubmit={handleSubmit}>
              <label className="form-field registration-field--wide">
                <span>Nome completo</span>
                <input name="nome" autoComplete="name" maxLength="100" required />
              </label>
              <label className="form-field">
                <span>E-mail</span>
                <input name="email" type="email" autoComplete="email" maxLength="150" required />
              </label>
              <label className="form-field">
                <span>Senha (mínimo 8 caracteres)</span>
                <span className="password-input">
                  <input
                    name="senha"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    minLength="8"
                    required
                  />
                  <button
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    className="password-input__toggle"
                    onClick={() => setShowPassword((visible) => !visible)}
                    type="button"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </span>
              </label>
              <label className="form-field">
                <span>Telefone com DDD</span>
                <input name="telefone" type="tel" inputMode="numeric" autoComplete="tel" maxLength="15" placeholder="(00) 00000-0000" required />
              </label>
              <label className="form-field">
                <span>CPF ou CNPJ</span>
                <input name="cpf_cnpj" inputMode="numeric" maxLength="18" placeholder="000.000.000-00" required />
              </label>
              <label className="form-field registration-field--wide">
                <span>Rua</span>
                <input name="rua" autoComplete="address-line1" maxLength="100" required />
              </label>
              <label className="form-field">
                <span>Número</span>
                <input name="numero_casa" type="number" min="0" step="1" required />
              </label>
              <label className="form-field">
                <span>Bairro</span>
                <input name="bairro" maxLength="100" required />
              </label>
              <label className="form-field">
                <span>CEP</span>
                <input name="cep" inputMode="numeric" autoComplete="postal-code" maxLength="9" placeholder="00000-000" required />
              </label>
              <label className="form-field">
                <span>Cidade</span>
                <input name="cidade" autoComplete="address-level2" maxLength="100" required />
              </label>
              <label className="form-field">
                <span>Estado</span>
                <input name="estado" autoComplete="address-level1" maxLength="30" required />
              </label>
              {message && <p className="login-message registration-field--wide" role="alert">{message}</p>}
              <button className="primary-button login-submit registration-field--wide" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Criando conta...' : 'Criar conta'}
              </button>
            </form>
            <p className="login-signup">
              Já tem uma conta? <Link to="/login">Entrar</Link>
            </p>
          </>
        )}
        <p className="login-footer">Refrigeração do Jair <span>·</span> Assistência Técnica em Geral</p>
      </section>
    </main>
  )
}

export default Registration
