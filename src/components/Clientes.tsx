import remorasLogo from '../assets/clientes/REMORAS.png'
import cptLogo from '../assets/clientes/CPT.png'
import korvikLogo from '../assets/clientes/KORVIK.png'
import yjTechLogo from '../assets/clientes/YJTECH.jpeg'
import simAustralLogo from '../assets/clientes/SIMAUSTRAL.jpeg'

const clientes = [
  {
    nombre: 'Remoras Pacific',
    logo: remorasLogo,
    clase: 'cliente-logo-remoras',
  },
  {
    nombre: 'CPT',
    logo: cptLogo,
    clase: 'cliente-logo-cpt',
  },
  {
    nombre: 'Naviera Korvik',
    logo: korvikLogo,
    clase: 'cliente-logo-korvik',
  },
  {
    nombre: 'YJ Tech Solutions SPA',
    logo: yjTechLogo,
    clase: 'cliente-logo-yjtech',
  },
  {
    nombre: 'SIMAUSTRAL',
    logo: simAustralLogo,
    clase: 'cliente-logo-simaustral',
  },
]

export default function Clientes() {
  return (
    <section
      className="clientes"
      id="clientes"
      aria-labelledby="titulo-clientes"
    >
      <div className="container">
        <div className="clientes-header">
          <p className="clientes-eyebrow">
            EMPRESAS QUE HAN CONFIADO EN NOSOTROS
          </p>

          <h2 id="titulo-clientes">
            Experiencia junto a empresas
            <span> del sector marítimo</span>
          </h2>

          <p className="clientes-intro">
            Hemos participado en servicios y trabajos técnicos para
            empresas vinculadas a operaciones marítimas, navieras y
            actividades productivas, entregando soluciones adaptadas
            a las necesidades de cada operación.
          </p>
        </div>

        <div className="clientes-grid">
          {clientes.map((cliente) => (
            <article
              className="cliente-card"
              key={cliente.nombre}
              aria-label={cliente.nombre}
            >
              <div className="cliente-logo-wrap">
                <img
                  src={cliente.logo}
                  alt={`Logo ${cliente.nombre}`}
                  className={`cliente-logo ${cliente.clase}`}
                  loading="lazy"
                />
              </div>

              <div className="cliente-card-footer">
                <span className="cliente-check" aria-hidden="true">
                  ✓
                </span>

                <span>{cliente.nombre}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="clientes-footer">
          <div className="clientes-footer-line" />

          <p>
            Confianza, experiencia y soluciones técnicas para
            operaciones marítimas.
          </p>

          <div className="clientes-footer-line" />
        </div>
      </div>
    </section>
  )
}