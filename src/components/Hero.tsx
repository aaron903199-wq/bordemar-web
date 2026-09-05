export default function Hero() {
  const whatsappUrl =
    'https://wa.me/56945852433?text=Hola%20Servicios%20Mar%C3%ADtimos%20Bordemar%20SPA%2C%20necesito%20informaci%C3%B3n%20sobre%20sus%20servicios.'

  return (
    <section className="hero" id="inicio">
      <div className="container hero-grid">

        <div className="hero-content">

          <p className="hero-eyebrow">
            SERVICIOS MARÍTIMOS · CHILE
          </p>

          <h1>
            Soluciones marítimas
            <span>para naves y empresas</span>
            del sector
          </h1>

          <p className="hero-description">
            Servicios técnicos, operacionales y documentales
            orientados a embarcaciones, armadores y empresas
            vinculadas a la actividad marítima.
          </p>

          <div className="hero-actions">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-primary hero-button-primary"
            >
              Solicitar cotización
              <span aria-hidden="true">→</span>
            </a>

            <a
              href="#servicios"
              className="button button-secondary hero-button-secondary"
            >
              Ver servicios
            </a>
          </div>

          <div className="hero-trust">

            <div className="hero-trust-item">
              <span className="hero-trust-number">
                01
              </span>

              <div>
                <strong>
                  Servicios técnicos
                </strong>

                <p>
                  Mantenimiento, electrónica marina,
                  inspecciones y equipamiento.
                </p>
              </div>
            </div>

            <div className="hero-trust-item">
              <span className="hero-trust-number">
                02
              </span>

              <div>
                <strong>
                  Operaciones marítimas
                </strong>

                <p>
                  Apoyo operacional y coordinación
                  de servicios en terreno.
                </p>
              </div>
            </div>

            <div className="hero-trust-item">
              <span className="hero-trust-number">
                03
              </span>

              <div>
                <strong>
                  Cobertura nacional
                </strong>

                <p>
                  Atención y coordinación de servicios
                  a lo largo de todo Chile.
                </p>
              </div>
            </div>

          </div>

        </div>

        <div className="hero-visual">

          <div className="hero-visual-card">

            <span className="hero-visual-label">
              BORDEMAR
            </span>

            <h2>
              Experiencia aplicada
              directamente en terreno
            </h2>

            <p>
              Soluciones pensadas para responder a los
              requerimientos reales de cada nave y operación.
            </p>

            <div className="hero-visual-line"></div>

            <div className="hero-visual-bottom">

              <div>
                <span>76</span>
                <p>Proyectos ejecutados</p>
              </div>

              <div>
                <span>56</span>
                <p>Naves atendidas</p>
              </div>

              <div>
                <span>105</span>
                <p>Clientes atendidos</p>
              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="container hero-bottom-bar">

        <span>
          ELECTRÓNICA MARINA
        </span>

        <span>
          MANTENIMIENTO
        </span>

        <span>
          CERTIFICACIONES
        </span>

        <span>
          DOCUMENTACIÓN
        </span>

        <span>
          APOYO OPERACIONAL
        </span>

      </div>
    </section>
  )
}