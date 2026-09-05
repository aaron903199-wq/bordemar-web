export default function Proyectos() {
  return (
    <section className="proyectos" id="proyectos">
      <div className="container">

        <div className="proyectos-header">
          <div>
            <p className="section-eyebrow">
              EXPERIENCIA EN TERRENO
            </p>

            <h2>
              Resultados que respaldan
              nuestro trabajo
            </h2>
          </div>

          <p className="proyectos-intro">
            Experiencia aplicada en servicios técnicos,
            mantenimiento, documentación y apoyo operacional
            para el sector marítimo.
          </p>
        </div>

        <div className="proyectos-contadores">

          <article className="contador-item">
            <span className="contador-label">
              EXPERIENCIA
            </span>

            <strong className="contador-numero">
              76
            </strong>

            <h3>
              Proyectos ejecutados
            </h3>

            <p>
              Servicios técnicos, operacionales y documentales
              desarrollados para el sector marítimo.
            </p>
          </article>

          <article className="contador-item">
            <span className="contador-label">
              OPERACIONES
            </span>

            <strong className="contador-numero">
              56
            </strong>

            <h3>
              Naves atendidas
            </h3>

            <p>
              Embarcaciones apoyadas mediante trabajos técnicos,
              mantenimiento e inspecciones.
            </p>
          </article>

          <article className="contador-item">
            <span className="contador-label">
              CONFIANZA
            </span>

            <strong className="contador-numero">
              105
            </strong>

            <h3>
              Clientes atendidos
            </h3>

            <p>
              Armadores, navieras, empresas y operadores
              vinculados a la actividad marítima.
            </p>
          </article>

          <article className="contador-item contador-cobertura">
            <span className="contador-label">
              COBERTURA NACIONAL
            </span>

            <div className="cobertura-icono" aria-hidden="true">
              <svg
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32 5C21.5 5 13 13.5 13 24c0 14.5 19 35 19 35s19-20.5 19-35C51 13.5 42.5 5 32 5Zm0 27.5A8.5 8.5 0 1 1 32 15a8.5 8.5 0 0 1 0 17.5Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <h3>
              Cobertura a lo largo
              de todo Chile
            </h3>

            <p>
              Coordinación y atención de servicios marítimos
              a nivel nacional.
            </p>
          </article>

        </div>

      </div>
    </section>
  )
}