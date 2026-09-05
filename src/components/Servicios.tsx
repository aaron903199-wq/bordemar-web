const servicios = [
  {
    numero: '01',
    titulo: 'Electrónica marina',
    descripcion:
      'Instalación, revisión y configuración de equipos de navegación, radar, GPS, AIS, VHF y sistemas electrónicos a bordo.',
    icono: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5M12 11a1 1 0 1 0 1 1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M12 12 20 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    numero: '02',
    titulo: 'Mantenimiento e inspecciones',
    descripcion:
      'Revisión técnica, mantenimiento preventivo y correctivo de equipos, sistemas y componentes de embarcaciones.',
    icono: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M14.8 6.2a4 4 0 0 0-5 5L4 17l3 3 5.8-5.8a4 4 0 0 0 5-5l-2.4 2.4-3-3 2.4-2.4Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    numero: '03',
    titulo: 'Certificaciones',
    descripcion:
      'Coordinación y apoyo técnico para certificación, revisión y verificación de equipamiento marítimo.',
    icono: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M7 3h10v18H7z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="m9.5 12 1.8 1.8 3.8-4.1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    numero: '04',
    titulo: 'Documentación marítima',
    descripcion:
      'Elaboración, regularización y apoyo documental para naves, operaciones, procedimientos y cumplimiento normativo.',
    icono: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6 3h8l4 4v14H6z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M14 3v5h5M9 13h6M9 17h6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    numero: '05',
    titulo: 'Maestranza y equipos de cubierta',
    descripcion:
      'Fabricación, reparación y trabajos asociados a grúas, anclas, estructuras, componentes y equipos de cubierta.',
    icono: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M5 19h14M8 19V8h8v11M10 8V5h4v3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 12h12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    numero: '06',
    titulo: 'Apoyo operacional',
    descripcion:
      'Servicios en terreno, coordinación técnica, apoyo a tripulaciones y asistencia operacional para empresas del sector marítimo.',
    icono: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 3v18M5 8h14M7 8c0 5 2 9 5 11 3-2 5-6 5-11"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

export default function Servicios() {
  return (
    <section className="servicios" id="servicios">
      <div className="container">

        <div className="servicios-header">
          <div>
            <p className="section-eyebrow">
              SERVICIOS MARÍTIMOS
            </p>

            <h2>
              Soluciones técnicas para
              cada necesidad a bordo
            </h2>
          </div>

          <p className="servicios-intro">
            Entregamos apoyo técnico, operacional y documental
            para naves, armadores y empresas vinculadas al sector marítimo.
          </p>
        </div>

        <div className="servicios-grid">
          {servicios.map((servicio) => (
            <article
              className="servicio-card servicio-card-modern"
              key={servicio.numero}
            >
              <div className="servicio-card-header">
                <span className="servicio-numero">
                  {servicio.numero}
                </span>

                <div className="servicio-icono">
                  {servicio.icono}
                </div>
              </div>

              <div className="servicio-card-content">
                <h3>{servicio.titulo}</h3>

                <p>{servicio.descripcion}</p>
              </div>

              <a
                href="#contacto"
                className="servicio-link"
              >
                Solicitar información
                <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}