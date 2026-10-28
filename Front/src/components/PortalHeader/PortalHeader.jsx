import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import {
  ClipboardList,
  FileText,
  History,
  LogOut,
  MessageSquareText,
  UserRound,
} from 'lucide-react'
import Brand from '../Brand/Brand.jsx'
import { clearSession } from '../../services/apiService.js'
import './PortalHeader.css'

const links = [
  { to: '/portal/chamados', label: 'Meus chamados', Icon: ClipboardList },
  { to: '/portal/solicitar-atendimento', label: 'Solicitar atendimento', Icon: MessageSquareText },
  { to: '/portal/orcamentos', label: 'Orçamentos', Icon: FileText },
  { to: '/portal/historico', label: 'Histórico de serviços', Icon: History },
  { to: '/portal/minha-conta', label: 'Minha conta', Icon: UserRound },
]

function PortalHeader() {
  const navigate = useNavigate()

  function handleLogout() {
    clearSession()
    navigate('/login', { replace: true })
  }

  return (
    <header className="portal-header">
      <div className="portal-header__inner">
        <NavLink className="portal-header__brand" to="/portal/solicitar-atendimento" aria-label="Refrigeração do Jair, início do portal">
          <Brand compact />
        </NavLink>
        <nav className="portal-nav" aria-label="Navegação do portal">
          {links.map(({ to, label, Icon }) => (
            <NavLink
              className={({ isActive }) => `portal-nav__link${isActive ? ' is-active' : ''}`}
              key={to}
              to={to}
            >
              <Icon size={17} strokeWidth={1.9} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
          <button className="portal-nav__link portal-nav__logout" onClick={handleLogout} type="button">
            <LogOut size={17} strokeWidth={1.9} aria-hidden="true" />
            <span>Sair</span>
          </button>
        </nav>
      </div>
    </header>
  )
}

export default PortalHeader