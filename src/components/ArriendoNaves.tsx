import smartsubFoto from '../assets/naves/fotos/SMARTSUB.jpeg'
import smartsubFicha from '../assets/naves/fichas/SMART LM.pdf'

const naves = [
  {
    id: 1,
    nombre: "SMART'SUB",
    matricula: 'MAU-4709',
    tipo: 'Nave menor de apoyo operacional',
    descripcion:
      'Embarcación disponible para arriendo y apoyo en operaciones marítimas, transporte de personal y trabajos asociados al sector acuícola y marítimo.',
    estado: 'Disponible para arriendo',
    imagen: smartsubFoto,
    fichaPdf: smartsubFicha,

    caracteristicas: [
      {
        titulo: 'Eslora',
        valor: '13,8 m',
        icono: 'longitud',
      },
      {
        titulo: 'Manga',
        valor: '4,7 m',
        icono: 'longitud',
      },
      {
        titulo: 'Capacidad',
        valor: '9 personas',
        icono: 'personas',
      },
      {
        titulo: 'Velocidad',
        valor: '8 nudos',
        icono: 'velocidad',
      },
    ],
  },
]

function IconoCaracteristica({
  tipo,
}: {
  tipo: string
}) {
  if (tipo === 'personas') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          cx="9"
          cy="8"
          r="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />

        <path
          d="M3.5 19c.4-4 2.5-6 5.5-6s5.1 2 5.5 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        <circle
          cx="17"
          cy="10"
          r="2.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />

        <path
          d="M15.5 14c2.8.2 4.6 1.8 5 4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (tipo === 'velocidad') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M4 17a8 8 0 1 1 16 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        <path
          d="M12 12l4-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        <path
          d="M7 17h10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M3 12h18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="m6 9-3 3 3 3M18 9l3 3-3 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ArriendoNaves() {
  const whatsappBase =
    'https://wa.me/56945852433?text='

  return (
    <section
      className="arriendo-naves"
      id="arriendo"
    >
      <div className="container">

        <div className="arriendo-header">

          <div>
            <p className="section-eyebrow">
              ARRIENDO DE NAVES
            </p>

            <h2>
              Naves disponibles
              <span>
                para sus operaciones
              </span>
            </h2>
          </div>

          <p className="arriendo-intro">
            Disponibilidad de embarcaciones para apoyo operacional,
            transporte, faenas marítimas y servicios vinculados
            al sector acuícola y marítimo.
          </p>

        </div>

        <div className="arriendo-grid">

          {naves.map((nave) => {
            const mensajeWhatsApp =
              encodeURIComponent(
                `Hola Servicios Marítimos Bordemar SPA, necesito información sobre el arriendo de la nave ${nave.nombre}, matrícula ${nave.matricula}.`
              )

            return (
              <article
                className="arriendo-card arriendo-card-destacada"
                key={nave.id}
              >

                <div className="arriendo-imagen arriendo-imagen-completa">

                  <img
                    src={nave.imagen}
                    alt={`${nave.nombre} ${nave.matricula}`}
                  />

                  <span className="arriendo-estado">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 16h18l-2 3H5l-2-3Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M8 16V8h8v8M10 8V5h4v3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    {nave.estado}
                  </span>

                </div>

                <div className="arriendo-card-content">

                  <span className="arriendo-tipo">
                    {nave.tipo}
                  </span>

                  <h3>
                    {nave.nombre}
                  </h3>

                  <p className="arriendo-matricula">
                    Matrícula {nave.matricula}
                  </p>

                  <p className="arriendo-descripcion">
                    {nave.descripcion}
                  </p>

                  <div className="arriendo-caracteristicas">

                    {nave.caracteristicas.map(
                      (caracteristica) => (
                        <div
                          className="arriendo-caracteristica"
                          key={caracteristica.titulo}
                        >

                          <div className="arriendo-caracteristica-icono">
                            <IconoCaracteristica
                              tipo={caracteristica.icono}
                            />
                          </div>

                          <div>
                            <span>
                              {caracteristica.titulo}
                            </span>

                            <strong>
                              {caracteristica.valor}
                            </strong>
                          </div>

                        </div>
                      )
                    )}

                  </div>

                  <div className="arriendo-actions">

                    <a
                      href={nave.fichaPdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="arriendo-pdf arriendo-boton-grande"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          d="M6 3h8l4 4v14H6z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinejoin="round"
                        />

                        <path
                          d="M14 3v5h5M9 13h6M9 17h4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                      </svg>

                      Ver ficha técnica PDF

                      <span aria-hidden="true">
                        →
                      </span>
                    </a>

                    <a
                      href={`${whatsappBase}${mensajeWhatsApp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="arriendo-whatsapp arriendo-boton-grande"
                    >
                      <svg
                        viewBox="0 0 32 32"
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M16.04 3C8.86 3 3.02 8.82 3.02 15.98c0 2.29.6 4.52 1.73 6.48L3 29l6.72-1.76a13 13 0 0 0 6.31 1.61h.01c7.18 0 13.02-5.82 13.02-12.98C29.06 8.82 23.22 3 16.04 3Zm0 23.66h-.01a10.8 10.8 0 0 1-5.52-1.51l-.4-.24-3.99 1.04 1.07-3.88-.26-.4a10.72 10.72 0 0 1-1.67-5.69c0-5.96 4.86-10.8 10.83-10.8 5.97 0 10.82 4.84 10.82 10.8 0 5.95-4.85 10.68-10.87 10.68Zm5.94-8.07c-.33-.17-1.92-.95-2.22-1.05-.3-.11-.52-.17-.74.16-.22.33-.85 1.05-1.04 1.27-.19.22-.38.25-.71.08-.33-.16-1.38-.5-2.63-1.6-.97-.86-1.62-1.93-1.81-2.25-.19-.33-.02-.5.14-.66.15-.15.33-.38.49-.57.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.58-.08-.16-.74-1.79-1.02-2.45-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.58.08-.88.41-.3.33-1.15 1.12-1.15 2.73s1.18 3.17 1.34 3.39c.16.22 2.32 3.54 5.62 4.96.78.34 1.4.54 1.87.69.79.25 1.5.21 2.07.13.63-.09 1.92-.79 2.19-1.55.27-.76.27-1.41.19-1.55-.08-.14-.3-.22-.63-.38Z"
                        />
                      </svg>

                      Consultar disponibilidad
                    </a>

                  </div>

                </div>

              </article>
            )
          })}

        </div>

      </div>
    </section>
  )
}