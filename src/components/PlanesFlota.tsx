const planes = [
  {
    nombre: 'Plan Esencial',
    subtitulo: 'Para naves individuales',
    descripcion:
      'Lo fundamental para mantener tu nave operativa, documentada y con seguimiento técnico periódico.',
    precio: 'Cotización personalizada',
    precioDetalle: 'según nave y requerimientos',
    destacado: false,
    etiqueta: '',
    items: [
      'Revisión técnica periódica',
      'Control de vencimientos',
      'Asesoría en certificaciones',
      'Soporte por WhatsApp',
      'Informe de cada visita',
    ],
  },
  {
    nombre: 'Plan Operacional',
    subtitulo: 'Para empresas y flotas medianas',
    descripcion:
      'Mayor cobertura y planificación para mantener la operación sin interrupciones y con seguimiento permanente.',
    precio: 'Cotización personalizada',
    precioDetalle: 'según operación y requerimientos',
    destacado: true,
    etiqueta: 'MÁS SOLICITADO',
    items: [
      'Todo lo del Plan Esencial',
      'Mantenimientos programados',
      'Inspecciones a bordo y en terreno',
      'Gestión documental y certificaciones',
      'Informes técnicos y recomendaciones',
      'Prioridad en atención',
    ],
  },
  {
    nombre: 'Plan Flota',
    subtitulo: 'Para salmoneras, navieras y armadores',
    descripcion:
      'Una solución integral para flotas, con enfoque en continuidad operacional, gestión técnica y control de riesgos.',
    precio: 'Cotización personalizada',
    precioDetalle: 'según flota y requerimientos',
    destacado: false,
    etiqueta: '',
    items: [
      'Todo lo del Plan Operacional',
      'Plan anual de mantenimiento',
      'Control de gestión y reportes ejecutivos',
      'Auditorías técnicas y de cumplimiento',
      'Capacitaciones a tripulación',
      'Asesoría en proyectos y mejoras',
      'Atención preferente y soporte dedicado',
    ],
  },
]

const beneficios = [
  {
    icono: '⚙',
    titulo: 'Mantenimiento programado',
  },
  {
    icono: '▤',
    titulo: 'Control documental y certificaciones',
  },
  {
    icono: '⚓',
    titulo: 'Visitas en terreno a lo largo de Chile',
  },
  {
    icono: '▥',
    titulo: 'Informes y reportes de gestión',
  },
  {
    icono: '◉',
    titulo: 'Soporte técnico directo',
  },
]

export default function PlanesFlota() {
  const crearWhatsapp = (plan: string) => {
    const mensaje = `
Hola Servicios Marítimos Bordemar SPA.

Quisiera recibir información sobre el ${plan}.

Necesito evaluar una solución para mi nave o flota.

Quedo atento a información y cotización.
    `.trim()

    return `https://wa.me/56945852433?text=${encodeURIComponent(
      mensaje,
    )}`
  }

  return (
    <section
      className="planes-flota"
      id="planes-flota"
      aria-labelledby="titulo-planes-flota"
    >
      <div className="planes-flota-hero">
        <div className="container">
          <div className="planes-flota-header">
            <div className="planes-flota-copy">
              <p className="planes-eyebrow">
                PLANES EMPRESAS
              </p>

              <h2 id="titulo-planes-flota">
                Soluciones para tu flota,
                <span> sin detener tu operación</span>
              </h2>

              <p className="planes-intro">
                Planes de mantenimiento, control documental,
                certificaciones y soporte técnico diseñados para
                salmoneras, navieras, armadores y empresas que
                necesitan continuidad operacional.
              </p>
            </div>

            <div className="planes-frase">
              Tu operación en buenas manos
            </div>
          </div>

          <div className="planes-beneficios-superiores">
            <div className="planes-beneficio-superior">
              <div className="planes-beneficio-icono">
                ✓
              </div>

              <div>
                <h3>Operación segura</h3>
                <p>
                  Menos fallas, más disponibilidad.
                </p>
              </div>
            </div>

            <div className="planes-beneficio-superior">
              <div className="planes-beneficio-icono">
                ▤
              </div>

              <div>
                <h3>Cumplimiento operacional</h3>
                <p>
                  Seguimiento documental y técnico.
                </p>
              </div>
            </div>

            <div className="planes-beneficio-superior">
              <div className="planes-beneficio-icono">
                ◉
              </div>

              <div>
                <h3>Soporte permanente</h3>
                <p>
                  Acompañamiento durante todo el año.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container planes-cards-wrap">
        <div className="planes-grid">
          {planes.map((plan) => (
            <article
              key={plan.nombre}
              className={`plan-card ${
                plan.destacado
                  ? 'plan-card-destacado'
                  : ''
              }`}
            >
              {plan.etiqueta && (
                <span className="plan-etiqueta">
                  {plan.etiqueta}
                </span>
              )}

              <div className="plan-card-icono">
                {plan.nombre === 'Plan Esencial'
                  ? '⚓'
                  : plan.nombre === 'Plan Operacional'
                    ? '🚢'
                    : '▦'}
              </div>

              <div className="plan-card-header">
                <h3>
                  {plan.nombre}
                </h3>

                <p className="plan-subtitulo">
                  {plan.subtitulo}
                </p>
              </div>

              <p className="plan-descripcion">
                {plan.descripcion}
              </p>

              <ul className="plan-lista">
                {plan.items.map((item) => (
                  <li key={item}>
                    <span aria-hidden="true">
                      ✓
                    </span>

                    {item}
                  </li>
                ))}
              </ul>

              <div className="plan-precio">
                <span className="plan-precio-principal">
                  {plan.precio}
                </span>

                <span className="plan-precio-detalle">
                  {plan.precioDetalle}
                </span>
              </div>

              <a
                href={crearWhatsapp(plan.nombre)}
                target="_blank"
                rel="noopener noreferrer"
                className={`plan-button ${
                  plan.destacado
                    ? 'plan-button-destacado'
                    : ''
                }`}
              >
                Solicitar cotización

                <span aria-hidden="true">
                  →
                </span>
              </a>
            </article>
          ))}
        </div>
      </div>

      <div className="planes-beneficios">
        <div className="container planes-beneficios-grid">
          {beneficios.map((beneficio) => (
            <div
              className="planes-beneficio"
              key={beneficio.titulo}
            >
              <div className="planes-beneficio-circle">
                {beneficio.icono}
              </div>

              <p>
                {beneficio.titulo}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="planes-socio">
        <div className="container planes-socio-grid">
          <div className="planes-socio-imagen">
            <div className="planes-socio-marca">
              BORDEMAR

              <span>
                Servicios Marítimos
              </span>
            </div>
          </div>

          <div className="planes-socio-content">
            <p className="planes-socio-eyebrow">
              SOLUCIONES PARA EMPRESAS
            </p>

            <h3>
              Tu socio estratégico
              <span> en el mar</span>
            </h3>

            <p className="planes-socio-texto">
              Trabajamos junto a tu equipo para que cada nave opere
              de forma segura, eficiente y con seguimiento técnico,
              entregando soluciones adaptadas a las necesidades de
              cada operación.
            </p>

            <div className="planes-socio-datos">
              <div>
                <strong>
                  76
                </strong>

                <span>
                  Proyectos ejecutados
                </span>
              </div>

              <div>
                <strong>
                  56
                </strong>

                <span>
                  Naves atendidas
                </span>
              </div>

              <div>
                <strong>
                  105
                </strong>

                <span>
                  Clientes atendidos
                </span>
              </div>

              <div>
                <strong>
                  Chile
                </strong>

                <span>
                  Cobertura nacional
                </span>
              </div>
            </div>

            <a
              href="https://wa.me/56945852433?text=Hola%20Servicios%20Mar%C3%ADtimos%20Bordemar%20SPA%2C%20quiero%20evaluar%20un%20plan%20de%20servicios%20para%20mi%20flota."
              target="_blank"
              rel="noopener noreferrer"
              className="planes-socio-button"
            >
              Hablemos de tu flota

              <span aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}   