import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import PortalHeader from './components/PortalHeader/PortalHeader.jsx'
import Account from './pages/Account/Account.jsx'
import Login from './pages/Login/Login.jsx'
import Registration from './pages/Registration/Registration.jsx'
import PortalSection from './pages/PortalSection/PortalSection.jsx'
import RequestService from './pages/RequestService/RequestService.jsx'
import { getAccessToken } from './services/apiService.js'
import './App.css'

function RequireAuth() {
  const [authenticated, setAuthenticated] = useState(Boolean(getAccessToken()))

  useEffect(() => {
    function updateAuthentication() {
      setAuthenticated(Boolean(getAccessToken()))
    }

    window.addEventListener('auth-change', updateAuthentication)
    return () => window.removeEventListener('auth-change', updateAuthentication)
  }, [])

  return authenticated ? <Outlet /> : <Navigate to="/login" replace />
}

function PortalLayout() {
  return (
    <div className="portal-shell">
      <PortalHeader />
      <main className="portal-main">
        <Outlet />
      </main>
      <footer className="portal-footer">
        Refrigeração do Jair <span aria-hidden="true">·</span> Assistência Técnica em Geral
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={getAccessToken() ? <Navigate to="/portal" replace /> : <Login />}
        />
        <Route path="/cadastro" element={<Registration />} />
        <Route element={<RequireAuth />}>
          <Route path="/portal" element={<PortalLayout />}>
            <Route index element={<Navigate to="solicitar-atendimento" replace />} />
            <Route path="solicitar-atendimento" element={<RequestService />} />
            <Route path="chamados" element={<PortalSection section="chamados" />} />
            <Route path="orcamentos" element={<PortalSection section="orcamentos" />} />
            <Route path="historico" element={<PortalSection section="historico" />} />
            <Route path="minha-conta" element={<Account />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
