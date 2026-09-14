import { FormEvent, useState } from 'react'
import visitaTecnicaImg from '../assets/galeria/inspeccion de nave.jpeg'

interface FormData {
  nombre: string
  telefono: string
  correo: string
  empresa: string
  nave: string
  matricula: string
  ubicacion: string
  fecha: string
  servicio: string
  necesidad: string
}

const initialForm: FormData = {
  nombre: '',
  telefono: '',
  correo: '',
  empresa: '',
  nave: '',
  matricula: '',
  ubicacion: '',
  fecha: '',
  servicio: '',
  necesidad: '',
}

export default function VisitaTecnica() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [aceptaContacto, setAceptaContacto] = useState(false)

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!aceptaContacto) {
      alert(
        'Debes aceptar el uso de tus datos para que podamos contactarte.',
      )
      return
    }

    const mensaje = `
Hola Servicios Marítimos Bordemar SPA.

Quiero solicitar una VISITA TÉCNICA.

DATOS DEL SOLICITANTE
Nombre: ${form.nombre}
Teléfono: ${form.telefono}
Correo: ${form.correo}
Empresa: ${form.empresa || 'No indicada'}

DATOS DE LA NAVE
Nombre de la nave: ${form.nave}
Matrícula: ${form.matricula || 'No indicada'}
Ubicación actual: ${form.ubicacion}
Fecha estimada: ${form.fecha || 'Por coordinar'}

SERVICIO REQUERIDO
${form.servicio}

NECESIDAD / OBSERVACIONES
${form.necesidad}

Quedo atento a coordinación y cotización.
    `.trim()

    const url = `https://wa.me/56945852433?text=${encodeURIComponent(
      mensaje,
    )}`

    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section
      className="visita-tecnica"
      id="visita-tecnica"
      aria-labelledby="titulo-visita-tecnica"
    >
      <div
        className="visita-tecnica-bg"
        style={{
          backgroundImage: `linear-gradient(
            90deg,
            rgba(4, 37, 66, 0.96) 0%,
            rgba(4, 49, 83, 0.86) 42%,
            rgba(4, 37, 66, 0.28) 68%,
            rgba(4, 37, 66, 0.08) 100%
          ),
          url("${visitaTecnicaImg}")`,
        }}
      />

      <div className="container visita-tecnica-container">
        <div className="visita-tecnica-info">
          <p className="visita-eyebrow">
            ATENCIÓN EN TERRENO
          </p>

          <h2 id="titulo-visita-tecnica">
            Solicita una
            <span> visita técnica</span>
          </h2>

          <p className="visita-descripcion">
            Evaluamos las necesidades de tu embarcación y coordinamos
            soluciones técnicas, mantenimiento, documentación e
            inspecciones en terreno.
          </p>

          <div className="visita-beneficios">
            <div className="visita-beneficio">
              <div className="visita-icono">⚙</div>

              <div>
                <h3>Revisión en terreno</h3>
                <p>Evaluación técnica de la nave y sus equipos.</p>
              </div>
            </div>

            <div className="visita-beneficio">
              <div className="visita-icono">▤</div>

              <div>
                <h3>Informe y recomendaciones</h3>
                <p>
                  Observaciones técnicas claras para orientar las
                  acciones necesarias.
                </p>
              </div>
            </div>

            <div className="visita-beneficio">
              <div className="visita-icono">✓</div>

              <div>
                <h3>Plan de acción</h3>
                <p>
                  Propuestas de solución según los requerimientos
                  de cada embarcación.
                </p>
              </div>
            </div>

            <div className="visita-beneficio">
              <div className="visita-icono">⌖</div>

              <div>
                <h3>Cobertura nacional</h3>
                <p>Coordinación de servicios a lo largo de Chile.</p>
              </div>
            </div>

            <div className="visita-beneficio">
              <div className="visita-icono">⚓</div>

              <div>
                <h3>Experiencia marítima</h3>
                <p>
                  Atención orientada a operaciones y necesidades
                  reales de las naves.
                </p>
              </div>
            </div>
          </div>

          <div className="visita-frase">
            Navegamos contigo
          </div>
        </div>

        <div className="visita-form-card">
          <div className="visita-form-header">
            <div className="visita-form-icon">▤</div>

            <div>
              <h3>Solicita una visita técnica</h3>
              <p>Completa el formulario y nos contactaremos contigo.</p>
            </div>
          </div>

          <form
            className="visita-form"
            onSubmit={handleSubmit}
          >
            <div className="visita-form-grid">
              <label>
                Nombre completo <span>*</span>

                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </label>

              <label>
                Teléfono <span>*</span>

                <input
                  type="tel"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="Ej: +56 9 1234 5678"
                  required
                />
              </label>

              <label>
                Correo electrónico <span>*</span>

                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  placeholder="Ej: correo@empresa.cl"
                  required
                />
              </label>

              <label>
                Empresa <small>opcional</small>

                <input
                  type="text"
                  name="empresa"
                  value={form.empresa}
                  onChange={handleChange}
                  placeholder="Ej: Naviera, salmonera, armador"
                />
              </label>

              <label>
                Nombre de la nave <span>*</span>

                <input
                  type="text"
                  name="nave"
                  value={form.nave}
                  onChange={handleChange}
                  placeholder="Ej: Don Enrique"
                  required
                />
              </label>

              <label>
                Matrícula <small>opcional</small>

                <input
                  type="text"
                  name="matricula"
                  value={form.matricula}
                  onChange={handleChange}
                  placeholder="Ej: CAB 5058"
                />
              </label>

              <label>
                Ubicación actual de la nave <span>*</span>

                <input
                  type="text"
                  name="ubicacion"
                  value={form.ubicacion}
                  onChange={handleChange}
                  placeholder="Ej: Puerto Montt, Chiloé, Aysén..."
                  required
                />
              </label>

              <label>
                Fecha estimada

                <input
                  type="date"
                  name="fecha"
                  value={form.fecha}
                  onChange={handleChange}
                />
              </label>
            </div>

            <label className="visita-form-full">
              Tipo de servicio <span>*</span>

              <select
                name="servicio"
                value={form.servicio}
                onChange={handleChange}
                required
              >
                <option value="">
                  Selecciona un servicio
                </option>

                <option value="Auditoría integral de nave">
                  Auditoría integral de nave
                </option>

                <option value="Certificaciones e inspecciones">
                  Certificaciones e inspecciones
                </option>

                <option value="Mantenimiento">
                  Mantenimiento
                </option>

                <option value="Electrónica marina">
                  Electrónica marina
                </option>

                <option value="Equipos de cubierta">
                  Equipos de cubierta
                </option>

                <option value="Planes y documentación">
                  Planes y documentación
                </option>

                <option value="Regularización documental">
                  Regularización documental
                </option>

                <option value="Otro servicio">
                  Otro servicio
                </option>
              </select>
            </label>

            <label className="visita-form-full">
              Cuéntanos brevemente tu necesidad <span>*</span>

              <textarea
                name="necesidad"
                value={form.necesidad}
                onChange={handleChange}
                rows={4}
                placeholder="Ej: revisión de equipos, mantenimiento, certificaciones, documentación, electrónica..."
                required
              />
            </label>

            <div className="visita-adjuntos">
              <div className="visita-adjuntos-icon">
                📎
              </div>

              <div>
                <strong>¿Tienes fotos o documentos?</strong>

                <p>
                  Podrás adjuntarlos directamente cuando se abra
                  WhatsApp después de enviar la solicitud.
                </p>
              </div>
            </div>

            <div className="visita-form-bottom">
              <label className="visita-checkbox">
                <input
                  type="checkbox"
                  checked={aceptaContacto}
                  onChange={(event) =>
                    setAceptaContacto(event.target.checked)
                  }
                />

                <span>
                  Acepto que mis datos sean utilizados para
                  contactarme.
                </span>
              </label>

              <button
                type="submit"
                className="visita-submit"
              >
                Enviar solicitud
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="visita-contacto-directo">
        <div className="container visita-contacto-wrap">
          <div className="visita-contacto-text">
            <strong>¿Prefieres contacto directo?</strong>
            <span>También puedes escribirnos o llamarnos.</span>
          </div>

          <div className="visita-contacto-actions">
            <a
              href="https://wa.me/56945852433"
              target="_blank"
              rel="noopener noreferrer"
              className="visita-whatsapp"
            >
              WhatsApp
            </a>

            <a
              href="tel:+56945852433"
              className="visita-contact-link"
            >
              +56 9 4585 2433
            </a>

            <a
              href="mailto:aaron903199@gmail.com"
              className="visita-contact-link"
            >
              aaron903199@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}