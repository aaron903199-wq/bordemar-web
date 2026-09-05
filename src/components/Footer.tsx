import logoBordemar from '../assets/logobordemar.png'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-main">

        <div className="footer-brand">
          <a href="#inicio" className="footer-logo-link">
            <img
              src={logoBordemar}
              alt="Servicios Marítimos Bordemar SPA"
              className="footer-logo"
            />
          </a>

          <p>
            Soluciones técnicas, operacionales y documentales
            para naves, armadores y empresas del sector marítimo.
          </p>

          <span className="footer-coverage">
            Cobertura a lo largo de todo Chile
          </span>
        </div>

        <div className="footer-column">
          <span className="footer-column-label">
            NAVEGACIÓN
          </span>

          <nav className="footer-nav">
            <a href="#inicio">Inicio</a>
            <a href="#nosotros">Nosotros</a>
            <a href="#servicios">Servicios</a>
            <a href="#proyectos">Proyectos</a>
            <a href="#galeria">Galería</a>
            <a href="#contacto">Contacto</a>
          </nav>
        </div>

        <div className="footer-column">
          <span className="footer-column-label">
            CONTACTO
          </span>

          <div className="footer-contact-list">

            <a href="tel:+56945852433">
              <span>Teléfono / WhatsApp</span>
              <strong>+56 9 4585 2433</strong>
            </a>

            <a href="mailto:aaron903199@gmail.com">
              <span>Correo electrónico</span>
              <strong>aaron903199@gmail.com</strong>
            </a>

          </div>
        </div>

        <div className="footer-column footer-cta">
          <span className="footer-column-label">
            ¿NECESITAS UN SERVICIO?
          </span>

          <h3>
            Conversemos sobre
            tu requerimiento.
          </h3>

          <a
            href="https://wa.me/56945852433?text=Hola%20Servicios%20Mar%C3%ADtimos%20Bordemar%20SPA%2C%20necesito%20informaci%C3%B3n%20sobre%20sus%20servicios."
            target="_blank"
            rel="noopener noreferrer"
            className="footer-whatsapp"
          >
            Contactar por WhatsApp

            <span aria-hidden="true">→</span>
          </a>
        </div>

      </div>

      <div className="container">
        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p>
            © 2026 Servicios Marítimos Bordemar SPA.
            Todos los derechos reservados.
          </p>

          <p className="footer-bottom-tagline">
            Servicios marítimos · Chile
          </p>
        </div>
      </div>
    </footer>
  )
}