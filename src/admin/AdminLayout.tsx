import { NavLink, Outlet } from 'react-router-dom'
import logoBordemar from '../assets/logobordemar.png'
import './Admin.css'

export default function AdminLayout() {
  return (
    <div className="admin-shell">

      <aside className="admin-sidebar">

        <div className="admin-brand">
          <img
            src={logoBordemar}
            alt="Servicios Marítimos Bordemar SPA"
          />

          <div>
            <strong>BORDEMAR CERT</strong>
            <span>Gestión de Certificados</span>
          </div>
        </div>

        <nav className="admin-navigation">

          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? 'admin-nav-active' : ''
            }
          >
            <span>⌂</span>
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/clientes"
            className={({ isActive }) =>
              isActive ? 'admin-nav-active' : ''
            }
          >
            <span>▣</span>
            Clientes
          </NavLink>

          <NavLink
            to="/admin/naves"
            className={({ isActive }) =>
              isActive ? 'admin-nav-active' : ''
            }
          >
            <span>⚓</span>
            Naves
          </NavLink>

          <NavLink
            to="/admin/equipos"
            className={({ isActive }) =>
              isActive ? 'admin-nav-active' : ''
            }
          >
            <span>⚙</span>
            Equipos
          </NavLink>

          <NavLink
            to="/admin/certificados"
            className={({ isActive }) =>
              isActive ? 'admin-nav-active' : ''
            }
          >
            <span>▤</span>
            Certificados
          </NavLink>

        </nav>

        <div className="admin-sidebar-footer">
          <span>SERVICIOS MARÍTIMOS</span>
          <strong>BORDEMAR SPA</strong>
        </div>

      </aside>

      <section className="admin-main">

        <header className="admin-topbar">

          <div>
            <span className="admin-topbar-label">
              SISTEMA DE GESTIÓN
            </span>

            <strong>BORDEMAR CERT</strong>
          </div>

          <a
            href="/"
            className="admin-return"
          >
            ← Volver al sitio web
          </a>

        </header>

        <div className="admin-content">
          <Outlet />
        </div>

      </section>

    </div>
  )
}