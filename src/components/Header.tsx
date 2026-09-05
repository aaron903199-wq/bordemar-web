import { useState } from 'react'
import logoBordemar from '../assets/logobordemar.png'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <a
          href="#inicio"
          className="brand"
          onClick={closeMenu}
        >
          <img
            src={logoBordemar}
            alt="Servicios Marítimos Bordemar SPA"
            className="brand-logo"
          />
        </a>

        <nav className="main-nav">
          <a href="#inicio">Inicio</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#servicios">Servicios</a>
          <a href="#proyectos">Proyectos</a>
          <a href="#galeria">Galería</a>
          <a href="#arriendo">Arriendo</a>
          <a href="#contacto">Contacto</a>
        </nav>

        <button
          type="button"
          className={`menu-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú de navegación"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
          <a href="#inicio" onClick={closeMenu}>
            Inicio
          </a>

          <a href="#nosotros" onClick={closeMenu}>
            Nosotros
          </a>

          <a href="#servicios" onClick={closeMenu}>
            Servicios
          </a>

          <a href="#proyectos" onClick={closeMenu}>
            Proyectos
          </a>

          <a href="#galeria" onClick={closeMenu}>
            Galería
          </a>

          <a href="#arriendo" onClick={closeMenu}>
            Arriendo de Naves
          </a>

          <a href="#contacto" onClick={closeMenu}>
            Contacto
          </a>
        </nav>
      </div>
    </header>
  )
}