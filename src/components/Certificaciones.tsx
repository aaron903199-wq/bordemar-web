const grupos = [
  {
    numero: '01',
    titulo: 'Certificaciones e inspecciones',
    servicios: [
      'Certificación ROE',
      'Tabla de desvío',
      'Compás magnético',
      'Barómetro',
      'Inspecciones técnicas',
    ],
  },
  {
    numero: '02',
    titulo: 'Equipos de cubierta',
    servicios: [
      'Grúas',
      'Viradores',
      'Cabrestantes',
      'Generadores',
      'Equipos asociados',
    ],
  },
  {
    numero: '03',
    titulo: 'Planes y documentación',
    servicios: [
      'Planes de contingencia',
      'Planes de mantenimiento',
      'Bitácoras de mantenimiento',
      'Procedimientos técnicos',
      'Documentación marítima',
    ],
  },
  {
    numero: '04',
    titulo: 'Electrónica marina',
    servicios: [
      'Radar',
      'AIS',
      'GPS / Plotter',
      'Radio VHF',
      'Integración de sistemas',
      'Instalación de cámaras CCTV',
      'Instalación de STARLINK',
    ],
  },
]

const ingenieriaNavalItems = [
  'Plano de Arreglo General (PAG)',
  'Plano de Seguridad (PSG)',
  'Plano de Diagrama Eléctrico (PEL)',
  'Plano de Líneas (PLI)',
  'Plano de Achique y Lucha Contra Incendios (PBF)',
  'Plano de Circuito de Combustible (PFC)',
  'Plano de Secciones Típicas y Cuaderna Maestra',
  'Plano de Perfil Longitudinal (PLP)',
  'Minuta de Arqueo (ARQ)',
  'Especificaciones Técnicas',
  'Estudios y cálculos de estabilidad',
  'Inspecciones y levantamientos técnicos',
  'Regularización y actualización de planos',
]

const auditoriaItems = [
  'Documentación',
  'Seguridad',
  'Electrónica marina',
  'Equipos de cubierta',
  'Mantenimiento',
  'Informe final de observaciones',
]

export default function Certificaciones() {
  const whatsappUrl =
    'https://wa.me/56945852433?text=Hola%20Servicios%20Mar%C3%ADtimos%20Bordemar%20SPA%2C%20necesito%20informaci%C3%B3n%20sobre%20certificaciones%20y%20servicios%20t%C3%A9cnicos%20para%20una%20nave.'

  const ingenieriaWhatsappUrl =
    'https://wa.me/56945852433?text=Hola%20Servicios%20Mar%C3%ADtimos%20Bordemar%20SPA%2C%20necesito%20informaci%C3%B3n%20y%20cotizaci%C3%B3n%20sobre%20servicios%20de%20Ingenier%C3%ADa%20Naval.'

  const auditoriaWhatsappUrl =
    'https://wa.me/56945852433?text=Hola%20Servicios%20Mar%C3%ADtimos%20Bordemar%20SPA%2C%20necesito%20informaci%C3%B3n%20y%20cotizaci%C3%B3n%20para%20realizar%20una%20Auditor%C3%ADa%20Integral%20de%20Nave.'

  return (
    <section
      className="certificaciones"
      id="certificaciones"
      aria-labelledby="titulo-certificaciones"
    >
      <div className="container">
        <div className="certificaciones-header">
          <div>
            <p className="section-eyebrow">
              CERTIFICACIONES Y SERVICIOS TÉCNICOS
            </p>

            <h2 id="titulo-certificaciones">
              Soluciones técnicas para
              <span> la operación de tu nave</span>
            </h2>
          </div>

          <p className="certificaciones-intro">
            Apoyamos a armadores, operadores y empresas del sector marítimo
            con certificaciones, inspecciones, documentación técnica,
            mantenimiento, ingeniería naval y trabajos especializados a bordo.
          </p>
        </div>

        <div className="certificaciones-grid">
          {grupos.map((grupo) => (
            <article
              className="certificacion-card"
              key={grupo.numero}
            >
              <div className="certificacion-card-top">
                <span className="certificacion-numero">
                  {grupo.numero}
                </span>

                <div className="certificacion-linea" />
              </div>

              <h3>{grupo.titulo}</h3>

              <ul>
                {grupo.servicios.map((servicio) => (
                  <li key={servicio}>
                    <span aria-hidden="true">✓</span>
                    {servicio}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="ingenieria-naval">
          <div className="ingenieria-naval-header">
            <div>
              <p className="ingenieria-naval-label">
                INGENIERÍA NAVAL
              </p>

              <h3>
                Ingeniería que impulsa
                <span> tu operación</span>
              </h3>

              <p className="ingenieria-naval-intro">
                Desarrollamos y coordinamos soluciones de ingeniería naval
                orientadas al diseño, levantamiento, actualización y
                regularización de documentación técnica para embarcaciones
                y proyectos marítimos.
              </p>
            </div>

            <a
              href={ingenieriaWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button ingenieria-naval-button"
              aria-label="Solicitar cotización de ingeniería naval por WhatsApp"
            >
              Cotizar ingeniería
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="ingenieria-naval-grid">
            {ingenieriaNavalItems.map((item) => (
              <div
                className="ingenieria-naval-item"
                key={item}
              >
                <span aria-hidden="true">✓</span>
                <p>{item}</p>
              </div>
            ))}
          </div>

          <div className="ingenieria-naval-footer">
            <p>
              Elaboración, actualización y regularización de documentación
              y planos técnicos según los requerimientos aplicables a cada
              embarcación y proyecto.
            </p>
          </div>
        </div>

        <div className="auditoria-nave">
          <div className="auditoria-nave-header">
            <div>
              <p className="auditoria-nave-label">
                REVISIÓN PREVENTIVA INTEGRAL
              </p>

              <h3>Auditoría integral de nave</h3>

              <p className="auditoria-nave-intro">
                Realizamos una revisión preventiva de la embarcación para
                identificar observaciones, brechas documentales y aspectos
                técnicos que requieran atención antes de una fiscalización
                o inspección.
              </p>
            </div>

            <a
              href={auditoriaWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button auditoria-button"
              aria-label="Solicitar cotización de auditoría integral de nave por WhatsApp"
            >
              Solicitar auditoría
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="auditoria-nave-grid">
            {auditoriaItems.map((item) => (
              <div
                className="auditoria-nave-item"
                key={item}
              >
                <span aria-hidden="true">✓</span>
                <p>{item}</p>
              </div>
            ))}
          </div>

          <div className="auditoria-nave-footer">
            <p>
              Al finalizar la revisión se entrega un informe con las
              observaciones detectadas y recomendaciones para su
              regularización o atención.
            </p>
          </div>
        </div>

        <div className="certificaciones-cta">
          <div>
            <p className="certificaciones-cta-label">
              COTIZA TU REQUERIMIENTO
            </p>

            <h3>
              ¿Necesitas certificar, regularizar o preparar
              documentación para tu nave?
            </h3>

            <p>
              Coordinamos servicios técnicos, inspecciones,
              documentación, ingeniería naval y trabajos a bordo según
              los requerimientos de cada embarcación.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="button certificaciones-button"
            aria-label="Solicitar cotización de certificaciones y servicios técnicos por WhatsApp"
          >
            Solicitar cotización
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}