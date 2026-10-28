import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Brand from '../../components/Brand/Brand.jsx'
import { login } from '../../services/apiService.js'
import './Login.css'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    try {
      await login(formData.get('email'), formData.get('senha'))
      navigate('/portal/solicitar-atendimento', { replace: true })
    } catch (error) {
      setMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-title">
        <Brand />
        <div className="login-panel__divider" />
        <div className="login-heading">
          <p className="login-heading__eyebrow">PORTAL DO CLIENTE</p>
          <h1 id="login-title">Entrar</h1>
          <p>Acesse o sistema com seu usuário e senha.</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>E-mail</span>
            <input name="email" type="email" autoComplete="username" placeholder="seu@email.com" required />
          </label>
          <label className="form-field">
            <span>Senha</span>
            <span className="password-input">
              <input
                name="senha"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Sua senha"
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
          <div className="login-form__options">
            <button className="text-action" type="button" onClick={() => setMessage('Recuperação de senha ainda não está configurada.')}>
              Esqueci minha senha
            </button>
          </div>
          {message && <p className="login-message" role="alert">{message}</p>}
          <button className="primary-button login-submit" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="login-signup">
          Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
        </p>
        <p className="login-footer">Refrigeração do Jair <span>·</span> Assistência Técnica em Geral</p>
      </section>
    </main>
  )
}

export default Login