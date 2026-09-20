import { BrowserRouter, Routes, Route } from 'react-router-dom'

// =========================================================
// SITIO WEB PÚBLICO
// =========================================================

import Header from './components/Header'
import Hero from './components/Hero'
import Nosotros from './components/Nosotros'
import Servicios from './components/Servicios'
import Certificaciones from './components/Certificaciones'
import VisitaTecnica from './components/VisitaTecnica'
import PlanesFlota from './components/PlanesFlota'
import Galeria from './components/Galeria'
import ArriendoNaves from './components/ArriendoNaves'
import VentaEquipamiento from './components/VentaEquipamiento'
import Clientes from './components/Clientes'
import Contacto from './components/Contacto'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import ScrollToHash from './components/ScrollToHash'

// =========================================================
// VERIFICACIÓN PÚBLICA DE CERTIFICADOS
// =========================================================

import VerificarCertificado from './pages/VerificarCertificado'

// =========================================================
// BORDEMAR CERT - PANEL ADMINISTRATIVO
// =========================================================

import AdminLogin from './admin/AdminLogin'
import ProtectedAdminRoute from './admin/ProtectedAdminRoute'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import ClientesAdmin from './admin/pages/ClientesAdmin'
import NavesAdmin from './admin/pages/NavesAdmin'
import EquiposAdmin from './admin/pages/EquiposAdmin'
import CertificadosAdmin from './admin/pages/CertificadosAdmin'

// =========================================================
// PÁGINA PRINCIPAL
// =========================================================

function Inicio() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Nosotros />
        <Servicios />
        <Certificaciones />
        <VisitaTecnica />
        <PlanesFlota />
        <Galeria />
        <ArriendoNaves />
        <VentaEquipamiento />
        <Clientes />
        <Contacto />
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  )
}

// =========================================================
// PÁGINA PÚBLICA DE VERIFICACIÓN
// =========================================================

function PaginaVerificacion() {
  return (
    <>
      <Header />

      <VerificarCertificado />

      <Footer />
      <WhatsAppButton />
    </>
  )
}

// =========================================================
// APLICACIÓN
// =========================================================

export default function App() {
  return (
    <BrowserRouter>

      {/* Permite navegar correctamente a #servicios, #contacto, etc. */}
      <ScrollToHash />

      <Routes>

        {/* =================================================
            SITIO WEB PÚBLICO
           ================================================= */}

        <Route
          path="/"
          element={<Inicio />}
        />

        {/* =================================================
            VERIFICACIÓN PÚBLICA DE CERTIFICADOS
           ================================================= */}

        <Route
          path="/verificar-certificado"
          element={<PaginaVerificacion />}
        />

        {/* =================================================
            BORDEMAR CERT - LOGIN
           ================================================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* =================================================
            BORDEMAR CERT - PANEL PROTEGIDO
           ================================================= */}

        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >

          {/* Dashboard */}
          <Route
            index
            element={<AdminDashboard />}
          />

          {/* Clientes */}
          <Route
            path="clientes"
            element={<ClientesAdmin />}
          />

          {/* Naves */}
          <Route
            path="naves"
            element={<NavesAdmin />}
          />

          {/* Equipos */}
          <Route
            path="equipos"
            element={<EquiposAdmin />}
          />

          {/* Certificados */}
          <Route
            path="certificados"
            element={<CertificadosAdmin />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  )
}