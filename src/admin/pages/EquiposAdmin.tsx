import { FormEvent, useEffect, useState } from 'react'

interface Cliente {
  id: string
  businessName: string
  rut: string
}

interface Nave {
  id: string
  name: string
  registration: string
  callSign?: string
  vesselType?: string
  status: 'ACTIVE' | 'INACTIVE'
  client?: Cliente
}

interface Equipo {
  id: string
  name: string
  category?: string
  brand?: string
  model?: string
  serialNumber?: string
  location?: string
  description?: string
  notes?: string
  status: 'ACTIVE' | 'INACTIVE'
  vesselId: string
  vessel: Nave
}

interface FormEquipo {
  name: string
  category: string
  brand: string
  model: string
  serialNumber: string
  location: string
  description: string
  notes: string
  vesselId: string
}

const API_URL =
  import.meta.env.VITE_CERT_API_URL ||
  'http://localhost:3000'

// =========================================================
// AUTENTICACIÓN JWT
// =========================================================

const getAuthHeaders = () => {
  const token = localStorage.getItem(
    'bordemar_cert_token',
  )

  return {
    Authorization: `Bearer ${token ?? ''}`,
  }
}

const formularioInicial: FormEquipo = {
  name: '',
  category: '',
  brand: '',
  model: '',
  serialNumber: '',
  location: '',
  description: '',
  notes: '',
  vesselId: '',
}

export default function EquiposAdmin() {
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [naves, setNaves] = useState<Nave[]>([])

  const [equipoSeleccionado, setEquipoSeleccionado] =
    useState<Equipo | null>(null)

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false)

  const [cargando, setCargando] =
    useState(true)

  const [guardando, setGuardando] =
    useState(false)

  const [busqueda, setBusqueda] =
    useState('')

  const [mensaje, setMensaje] =
    useState('')

  const [error, setError] =
    useState('')

  const [formulario, setFormulario] =
    useState<FormEquipo>(formularioInicial)

  const [modoEdicion, setModoEdicion] =
    useState(false)

  const [formularioEdicion, setFormularioEdicion] =
    useState<FormEquipo>(formularioInicial)

  const [procesandoEstado, setProcesandoEstado] =
    useState(false)

  // =========================================================
  // SESIÓN EXPIRADA
  // =========================================================

  const cerrarSesionPorTokenInvalido = () => {
    localStorage.removeItem(
      'bordemar_cert_token',
    )

    window.location.href =
      '/admin/login'
  }

  // =========================================================
  // CARGAR EQUIPOS
  // =========================================================

  const cargarEquipos = async () => {
    try {
      setCargando(true)
      setError('')

      const response = await fetch(
        `${API_URL}/equipment`,
        {
          headers: {
            ...getAuthHeaders(),
          },
        },
      )

      if (response.status === 401) {
        cerrarSesionPorTokenInvalido()
        return
      }

      if (!response.ok) {
        throw new Error(
          'No fue posible cargar los equipos.',
        )
      }

      const data = await response.json()

      setEquipos(
        Array.isArray(data) ? data : [],
      )
    } catch (err) {
      console.error(err)

      setError(
        'No fue posible conectar con el servidor de equipos.',
      )
    } finally {
      setCargando(false)
    }
  }

  // =========================================================
  // CARGAR NAVES
  // =========================================================

  const cargarNaves = async () => {
    try {
      const response = await fetch(
        `${API_URL}/vessels`,
        {
          headers: {
            ...getAuthHeaders(),
          },
        },
      )

      if (response.status === 401) {
        cerrarSesionPorTokenInvalido()
        return
      }

      if (!response.ok) {
        throw new Error(
          'No fue posible cargar las naves.',
        )
      }

      const data = await response.json()

      setNaves(
        Array.isArray(data) ? data : [],
      )
    } catch (err) {
      console.error(err)

      setError(
        'No fue posible cargar las naves.',
      )
    }
  }

  // =========================================================
  // CARGA INICIAL
  // =========================================================

  useEffect(() => {
    cargarEquipos()
    cargarNaves()
  }, [])

  // =========================================================
  // ACTUALIZAR CAMPOS
  // =========================================================

  const actualizarCampo = (
    campo: keyof FormEquipo,
    valor: string,
  ) => {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }))
  }

  // =========================================================
  // ABRIR FORMULARIO
  // =========================================================

  const abrirFormulario = () => {
    setFormulario(formularioInicial)
    setError('')
    setMensaje('')
    setMostrarFormulario(true)
  }

  // =========================================================
  // CERRAR FORMULARIO
  // =========================================================

  const cerrarFormulario = () => {
    if (guardando) {
      return
    }

    setFormulario(formularioInicial)
    setError('')
    setMostrarFormulario(false)
  }

  // =========================================================
  // CREAR EQUIPO
  // =========================================================

  const guardarEquipo = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()

    setError('')
    setMensaje('')

    if (
      !formulario.name.trim() ||
      !formulario.vesselId
    ) {
      setError(
        'El nombre del equipo y la nave son obligatorios.',
      )

      return
    }

    try {
      setGuardando(true)

      const response = await fetch(
        `${API_URL}/equipment`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            ...getAuthHeaders(),
          },

          body: JSON.stringify({
            name:
              formulario.name.trim(),

            category:
              formulario.category.trim() ||
              undefined,

            brand:
              formulario.brand.trim() ||
              undefined,

            model:
              formulario.model.trim() ||
              undefined,

            serialNumber:
              formulario.serialNumber.trim() ||
              undefined,

            location:
              formulario.location.trim() ||
              undefined,

            description:
              formulario.description.trim() ||
              undefined,

            notes:
              formulario.notes.trim() ||
              undefined,

            vesselId:
              formulario.vesselId,
          }),
        },
      )

      if (response.status === 401) {
        cerrarSesionPorTokenInvalido()
        return
      }

      const data =
        await response.json()

      if (!response.ok) {
        const mensajeServidor =
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message

        throw new Error(
          mensajeServidor ||
            'No fue posible registrar el equipo.',
        )
      }

      setFormulario(
        formularioInicial,
      )

      setMostrarFormulario(false)

      setMensaje(
        `Equipo "${data.name}" registrado correctamente.`,
      )

      await cargarEquipos()
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible registrar el equipo.',
      )
    } finally {
      setGuardando(false)
    }
  }

  // =========================================================
  // EDITAR EQUIPO
  // =========================================================

  const abrirEdicion = () => {
    if (!equipoSeleccionado) return

    setError('')
    setMensaje('')

    setFormularioEdicion({
      name: equipoSeleccionado.name ?? '',
      category: equipoSeleccionado.category ?? '',
      brand: equipoSeleccionado.brand ?? '',
      model: equipoSeleccionado.model ?? '',
      serialNumber: equipoSeleccionado.serialNumber ?? '',
      location: equipoSeleccionado.location ?? '',
      description: equipoSeleccionado.description ?? '',
      notes: equipoSeleccionado.notes ?? '',
      vesselId: equipoSeleccionado.vesselId ?? '',
    })

    setModoEdicion(true)
  }

  const cancelarEdicion = () => {
    if (guardando) return

    setModoEdicion(false)
    setFormularioEdicion(formularioInicial)
    setError('')
  }

  const actualizarCampoEdicion = (
    campo: keyof FormEquipo,
    valor: string,
  ) => {
    setFormularioEdicion((actual) => ({
      ...actual,
      [campo]: valor,
    }))
  }

  const guardarEdicion = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()

    if (!equipoSeleccionado) return

    setError('')
    setMensaje('')

    if (
      !formularioEdicion.name.trim() ||
      !formularioEdicion.vesselId
    ) {
      setError(
        'El nombre del equipo y la nave son obligatorios.',
      )
      return
    }

    try {
      setGuardando(true)

      const response = await fetch(
        `${API_URL}/equipment/${equipoSeleccionado.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            name: formularioEdicion.name.trim(),
            category:
              formularioEdicion.category.trim() || undefined,
            brand:
              formularioEdicion.brand.trim() || undefined,
            model:
              formularioEdicion.model.trim() || undefined,
            serialNumber:
              formularioEdicion.serialNumber.trim() || undefined,
            location:
              formularioEdicion.location.trim() || undefined,
            description:
              formularioEdicion.description.trim() || undefined,
            notes:
              formularioEdicion.notes.trim() || undefined,
            vesselId: formularioEdicion.vesselId,
          }),
        },
      )

      if (response.status === 401) {
        cerrarSesionPorTokenInvalido()
        return
      }

      const data = await response.json()

      if (!response.ok) {
        const mensajeServidor =
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message

        throw new Error(
          mensajeServidor ||
            'No fue posible actualizar el equipo.',
        )
      }

      setEquipoSeleccionado(data)
      setModoEdicion(false)
      setFormularioEdicion(formularioInicial)
      setMensaje(
        `Equipo "${data.name}" actualizado correctamente.`,
      )

      await cargarEquipos()
    } catch (err) {
      console.error(err)
      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible actualizar el equipo.',
      )
    } finally {
      setGuardando(false)
    }
  }

  // =========================================================
  // ACTIVAR / DESACTIVAR EQUIPO
  // =========================================================

  const cambiarEstadoEquipo = async (
    accion: 'activate' | 'deactivate',
  ) => {
    if (!equipoSeleccionado) return

    const activar = accion === 'activate'
    const verbo = activar ? 'activar' : 'desactivar'

    const confirmado = window.confirm(
      `¿Deseas ${verbo} el equipo "${equipoSeleccionado.name}"?`,
    )

    if (!confirmado) return

    try {
      setProcesandoEstado(true)
      setError('')
      setMensaje('')

      const response = await fetch(
        `${API_URL}/equipment/${equipoSeleccionado.id}/${accion}`,
        {
          method: 'PATCH',
          headers: {
            ...getAuthHeaders(),
          },
        },
      )

      if (response.status === 401) {
        cerrarSesionPorTokenInvalido()
        return
      }

      const data = await response.json()

      if (!response.ok) {
        const mensajeServidor =
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message

        throw new Error(
          mensajeServidor ||
            `No fue posible ${verbo} el equipo.`,
        )
      }

      setEquipoSeleccionado(data)
      setMensaje(
        activar
          ? `Equipo "${data.name}" activado correctamente.`
          : `Equipo "${data.name}" desactivado correctamente.`,
      )

      await cargarEquipos()
    } catch (err) {
      console.error(err)
      setError(
        err instanceof Error
          ? err.message
          : `No fue posible ${verbo} el equipo.`,
      )
    } finally {
      setProcesandoEstado(false)
    }
  }

  // =========================================================
  // FILTRO DE EQUIPOS
  // =========================================================

  const equiposFiltrados =
    equipos.filter((equipo) => {
      const texto =
        busqueda
          .toLowerCase()
          .trim()

      return (
        equipo.name
          .toLowerCase()
          .includes(texto) ||

        (equipo.category ?? '')
          .toLowerCase()
          .includes(texto) ||

        (equipo.brand ?? '')
          .toLowerCase()
          .includes(texto) ||

        (equipo.model ?? '')
          .toLowerCase()
          .includes(texto) ||

        (equipo.serialNumber ?? '')
          .toLowerCase()
          .includes(texto) ||

        (equipo.vessel?.name ?? '')
          .toLowerCase()
          .includes(texto) ||

        (equipo.vessel?.registration ?? '')
          .toLowerCase()
          .includes(texto)
      )
    })

  return (
    <div className="admin-equipos">

      {/* =====================================================
          ENCABEZADO
         ===================================================== */}

      <div className="admin-page-header">

        <div>

          <span className="admin-eyebrow">
            GESTIÓN
          </span>

          <h1>
            Equipos
          </h1>

          <p>
            Equipamiento instalado y registrado
            por embarcación.
          </p>

        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={abrirFormulario}
        >
          + Nuevo equipo
        </button>

      </div>

      {/* =====================================================
          MENSAJES
         ===================================================== */}

      {mensaje && (
        <div className="admin-success-message">
          {mensaje}
        </div>
      )}

      {error && !mostrarFormulario && (
        <div className="admin-error-message">
          {error}
        </div>
      )}

      {/* =====================================================
          PANEL
         ===================================================== */}

      <section className="admin-panel admin-clientes-panel">

        <div className="admin-clientes-toolbar">

          <div className="admin-search-box">

            <span>
              ⌕
            </span>

            <input
              type="text"
              placeholder="Buscar por equipo, marca, modelo, serie o nave..."
              value={busqueda}
              onChange={(e) =>
                setBusqueda(
                  e.target.value,
                )
              }
            />

          </div>

          <div className="admin-clientes-count">

            <span>
              Total equipos
            </span>

            <strong>
              {equipos.length}
            </strong>

          </div>

        </div>

        <div className="admin-table-wrapper">

          <table className="admin-table">

            <thead>

              <tr>
                <th>Equipo</th>
                <th>Categoría</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>N° Serie</th>
                <th>Nave</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>

            </thead>

            <tbody>

              {cargando ? (

                <tr>

                  <td colSpan={8}>

                    <div className="admin-table-empty">

                      <p>
                        Cargando equipos...
                      </p>

                    </div>

                  </td>

                </tr>

              ) : equiposFiltrados.length === 0 ? (

                <tr className="admin-table-empty-row">

                  <td colSpan={8}>

                    <div className="admin-table-empty">

                      <div className="admin-empty-icon">
                        ⚙
                      </div>

                      <h3>
                        No existen equipos registrados
                      </h3>

                      <p>
                        Registra un equipo y asócialo
                        a una embarcación.
                      </p>

                      <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={abrirFormulario}
                      >
                        + Registrar primer equipo
                      </button>

                    </div>

                  </td>

                </tr>

              ) : (

                equiposFiltrados.map(
                  (equipo) => (

                    <tr key={equipo.id}>

                      <td>

                        <strong>
                          {equipo.name}
                        </strong>

                        {equipo.location && (

                          <div
                            style={{
                              fontSize:
                                '12px',

                              opacity:
                                0.65,

                              marginTop:
                                '4px',
                            }}
                          >
                            {
                              equipo.location
                            }
                          </div>

                        )}

                      </td>

                      <td>
                        {equipo.category ||
                          '—'}
                      </td>

                      <td>
                        {equipo.brand ||
                          '—'}
                      </td>

                      <td>
                        {equipo.model ||
                          '—'}
                      </td>

                      <td>
                        {equipo.serialNumber ||
                          '—'}
                      </td>

                      <td>

                        <strong>
                          {equipo.vessel
                            ?.name ||
                            '—'}
                        </strong>

                        {equipo.vessel
                          ?.registration && (

                          <div
                            style={{
                              fontSize:
                                '12px',

                              opacity:
                                0.65,

                              marginTop:
                                '4px',
                            }}
                          >
                            {
                              equipo.vessel
                                .registration
                            }
                          </div>

                        )}

                      </td>

                      <td>

                        <span
                          className={
                            equipo.status ===
                            'ACTIVE'
                              ? 'admin-status admin-status-active'
                              : 'admin-status admin-status-inactive'
                          }
                        >
                          {equipo.status ===
                          'ACTIVE'
                            ? 'ACTIVO'
                            : 'INACTIVO'}
                        </span>

                      </td>

                      <td>

                        <button
                          type="button"
                          className="admin-table-action"
                          onClick={() =>
                            setEquipoSeleccionado(equipo)
                          }
                        >
                          Ver
                        </button>

                      </td>

                    </tr>

                  ),
                )

              )}

            </tbody>

          </table>

        </div>

      </section>

      {/* =====================================================
          MODAL DETALLE / EDICIÓN DEL EQUIPO
         ===================================================== */}

      {equipoSeleccionado && (

        <div
          className="admin-modal-overlay"
          onMouseDown={() => {
            if (!guardando && !procesandoEstado) {
              setEquipoSeleccionado(null)
              setModoEdicion(false)
              setError('')
            }
          }}
        >

          <div
            className="admin-modal"
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>

                <span className="admin-eyebrow">
                  BORDEMAR CERT
                </span>

                <h2>
                  {modoEdicion
                    ? 'Editar equipo'
                    : equipoSeleccionado.name}
                </h2>

                <p>
                  {modoEdicion
                    ? 'Actualiza los datos del equipo registrado.'
                    : 'Ficha del equipo registrado a bordo.'}
                </p>

              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={() => {
                  if (!guardando && !procesandoEstado) {
                    setEquipoSeleccionado(null)
                    setModoEdicion(false)
                    setError('')
                  }
                }}
                disabled={guardando || procesandoEstado}
                aria-label="Cerrar"
              >
                ×
              </button>

            </div>

            {modoEdicion ? (

              <form onSubmit={guardarEdicion}>

                <div className="admin-form-grid">

                  <div className="admin-form-group admin-form-full">
                    <label>
                      Nave
                      <span>*</span>
                    </label>

                    <select
                      value={formularioEdicion.vesselId}
                      onChange={(e) =>
                        actualizarCampoEdicion(
                          'vesselId',
                          e.target.value,
                        )
                      }
                      required
                    >
                      <option value="">
                        Seleccionar embarcación
                      </option>

                      {naves
                        .filter(
                          (nave) =>
                            nave.status === 'ACTIVE' ||
                            nave.id === formularioEdicion.vesselId,
                        )
                        .map((nave) => (
                          <option
                            key={nave.id}
                            value={nave.id}
                          >
                            {nave.name} — {nave.registration}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>
                      Nombre del equipo
                      <span>*</span>
                    </label>

                    <input
                      type="text"
                      value={formularioEdicion.name}
                      onChange={(e) =>
                        actualizarCampoEdicion(
                          'name',
                          e.target.value,
                        )
                      }
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Categoría</label>

                    <select
                      value={formularioEdicion.category}
                      onChange={(e) =>
                        actualizarCampoEdicion(
                          'category',
                          e.target.value,
                        )
                      }
                    >
                      <option value="">
                        Seleccionar categoría
                      </option>
                      <option value="Equipo de cubierta">
                        Equipo de cubierta
                      </option>
                      <option value="Propulsión">
                        Propulsión
                      </option>
                      <option value="Generación eléctrica">
                        Generación eléctrica
                      </option>
                      <option value="Navegación">
                        Navegación
                      </option>
                      <option value="Radiocomunicaciones">
                        Radiocomunicaciones
                      </option>
                      <option value="Seguridad">
                        Seguridad
                      </option>
                      <option value="Salvamento">
                        Salvamento
                      </option>
                      <option value="Instrumentación">
                        Instrumentación
                      </option>
                      <option value="Otra">
                        Otra
                      </option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Marca</label>
                    <input
                      type="text"
                      value={formularioEdicion.brand}
                      onChange={(e) =>
                        actualizarCampoEdicion(
                          'brand',
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Modelo</label>
                    <input
                      type="text"
                      value={formularioEdicion.model}
                      onChange={(e) =>
                        actualizarCampoEdicion(
                          'model',
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Número de serie</label>
                    <input
                      type="text"
                      value={formularioEdicion.serialNumber}
                      onChange={(e) =>
                        actualizarCampoEdicion(
                          'serialNumber',
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Ubicación a bordo</label>
                    <input
                      type="text"
                      value={formularioEdicion.location}
                      onChange={(e) =>
                        actualizarCampoEdicion(
                          'location',
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="admin-form-group admin-form-full">
                    <label>Descripción</label>
                    <textarea
                      rows={3}
                      value={formularioEdicion.description}
                      onChange={(e) =>
                        actualizarCampoEdicion(
                          'description',
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="admin-form-group admin-form-full">
                    <label>Observaciones</label>
                    <textarea
                      rows={3}
                      value={formularioEdicion.notes}
                      onChange={(e) =>
                        actualizarCampoEdicion(
                          'notes',
                          e.target.value,
                        )
                      }
                    />
                  </div>

                </div>

                {error && (
                  <div className="admin-error-message">
                    {error}
                  </div>
                )}

                <div className="admin-modal-footer">

                  <button
                    type="button"
                    className="admin-cancel-button"
                    onClick={cancelarEdicion}
                    disabled={guardando}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="admin-primary-button"
                    disabled={guardando}
                  >
                    {guardando
                      ? 'Guardando...'
                      : 'Guardar cambios'}
                  </button>

                </div>

              </form>

            ) : (

              <>

                <div className="admin-form-grid">

                  <div className="admin-form-group">
                    <label>Estado</label>
                    <div>
                      <span
                        className={
                          equipoSeleccionado.status === 'ACTIVE'
                            ? 'admin-status admin-status-active'
                            : 'admin-status admin-status-inactive'
                        }
                      >
                        {equipoSeleccionado.status === 'ACTIVE'
                          ? 'ACTIVO'
                          : 'INACTIVO'}
                      </span>
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Categoría</label>
                    <div>
                      {equipoSeleccionado.category || '—'}
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Marca</label>
                    <div>
                      {equipoSeleccionado.brand || '—'}
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Modelo</label>
                    <div>
                      {equipoSeleccionado.model || '—'}
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Número de serie</label>
                    <div>
                      {equipoSeleccionado.serialNumber || '—'}
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Ubicación a bordo</label>
                    <div>
                      {equipoSeleccionado.location || '—'}
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Nave</label>
                    <div>
                      <strong>
                        {equipoSeleccionado.vessel?.name || '—'}
                      </strong>
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Matrícula</label>
                    <div>
                      {equipoSeleccionado.vessel?.registration || '—'}
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Señal de llamada</label>
                    <div>
                      {equipoSeleccionado.vessel?.callSign || '—'}
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Tipo de nave</label>
                    <div>
                      {equipoSeleccionado.vessel?.vesselType || '—'}
                    </div>
                  </div>

                  <div className="admin-form-group admin-form-full">
                    <label>Cliente / Armador</label>
                    <div>
                      {equipoSeleccionado.vessel?.client?.businessName || '—'}
                    </div>
                  </div>

                  <div className="admin-form-group admin-form-full">
                    <label>Descripción</label>
                    <div>
                      {equipoSeleccionado.description ||
                        'Sin descripción registrada.'}
                    </div>
                  </div>

                  <div className="admin-form-group admin-form-full">
                    <label>Observaciones</label>
                    <div>
                      {equipoSeleccionado.notes ||
                        'Sin observaciones registradas.'}
                    </div>
                  </div>

                </div>

                {error && (
                  <div className="admin-error-message">
                    {error}
                  </div>
                )}

                <div className="admin-modal-footer">

                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={abrirEdicion}
                    disabled={procesandoEstado}
                  >
                    Editar equipo
                  </button>

                  {equipoSeleccionado.status === 'ACTIVE' ? (
                    <button
                      type="button"
                      className="admin-cancel-button"
                      onClick={() =>
                        cambiarEstadoEquipo('deactivate')
                      }
                      disabled={procesandoEstado}
                    >
                      {procesandoEstado
                        ? 'Procesando...'
                        : 'Desactivar equipo'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="admin-secondary-button"
                      onClick={() =>
                        cambiarEstadoEquipo('activate')
                      }
                      disabled={procesandoEstado}
                    >
                      {procesandoEstado
                        ? 'Procesando...'
                        : 'Activar equipo'}
                    </button>
                  )}

                  <button
                    type="button"
                    className="admin-primary-button"
                    onClick={() => {
                      setEquipoSeleccionado(null)
                      setError('')
                    }}
                    disabled={procesandoEstado}
                  >
                    Cerrar
                  </button>

                </div>

              </>

            )}

          </div>

        </div>

      )}

      {/* =====================================================
          MODAL NUEVO EQUIPO
         ===================================================== */}

      {mostrarFormulario && (

        <div
          className="admin-modal-overlay"
          onMouseDown={
            cerrarFormulario
          }
        >

          <div
            className="admin-modal"
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>

                <span className="admin-eyebrow">
                  BORDEMAR CERT
                </span>

                <h2>
                  Nuevo equipo
                </h2>

                <p>
                  Registra un equipo y
                  asócialo a una embarcación.
                </p>

              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={
                  cerrarFormulario
                }
                disabled={guardando}
                aria-label="Cerrar"
              >
                ×
              </button>

            </div>

            <form onSubmit={guardarEquipo}>

              <div className="admin-form-grid">

                {/* NAVE */}

                <div className="admin-form-group admin-form-full">

                  <label>
                    Nave
                    <span>*</span>
                  </label>

                  <select
                    value={
                      formulario.vesselId
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'vesselId',
                        e.target.value,
                      )
                    }
                    required
                  >

                    <option value="">
                      Seleccionar embarcación
                    </option>

                    {naves
                      .filter(
                        (nave) =>
                          nave.status ===
                          'ACTIVE',
                      )
                      .map(
                        (nave) => (

                          <option
                            key={nave.id}
                            value={nave.id}
                          >
                            {nave.name} —{' '}
                            {nave.registration}
                          </option>

                        ),
                      )}

                  </select>

                </div>

                {/* NOMBRE */}

                <div className="admin-form-group">

                  <label>
                    Nombre del equipo
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Ej: GRÚA PALFINGER"
                    value={
                      formulario.name
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'name',
                        e.target.value,
                      )
                    }
                    required
                  />

                </div>

                {/* CATEGORÍA */}

                <div className="admin-form-group">

                  <label>
                    Categoría
                  </label>

                  <select
                    value={
                      formulario.category
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'category',
                        e.target.value,
                      )
                    }
                  >

                    <option value="">
                      Seleccionar categoría
                    </option>

                    <option value="Equipo de cubierta">
                      Equipo de cubierta
                    </option>

                    <option value="Propulsión">
                      Propulsión
                    </option>

                    <option value="Generación eléctrica">
                      Generación eléctrica
                    </option>

                    <option value="Navegación">
                      Navegación
                    </option>

                    <option value="Radiocomunicaciones">
                      Radiocomunicaciones
                    </option>

                    <option value="Seguridad">
                      Seguridad
                    </option>

                    <option value="Salvamento">
                      Salvamento
                    </option>

                    <option value="Instrumentación">
                      Instrumentación
                    </option>

                    <option value="Otra">
                      Otra
                    </option>

                  </select>

                </div>

                {/* MARCA */}

                <div className="admin-form-group">

                  <label>
                    Marca
                  </label>

                  <input
                    type="text"
                    placeholder="Ej: Palfinger"
                    value={
                      formulario.brand
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'brand',
                        e.target.value,
                      )
                    }
                  />

                </div>

                {/* MODELO */}

                <div className="admin-form-group">

                  <label>
                    Modelo
                  </label>

                  <input
                    type="text"
                    placeholder="Ej: PK23500"
                    value={
                      formulario.model
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'model',
                        e.target.value,
                      )
                    }
                  />

                </div>

                {/* SERIE */}

                <div className="admin-form-group">

                  <label>
                    Número de serie
                  </label>

                  <input
                    type="text"
                    placeholder="Número de serie"
                    value={
                      formulario.serialNumber
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'serialNumber',
                        e.target.value,
                      )
                    }
                  />

                </div>

                {/* UBICACIÓN */}

                <div className="admin-form-group">

                  <label>
                    Ubicación a bordo
                  </label>

                  <input
                    type="text"
                    placeholder="Ej: Cubierta"
                    value={
                      formulario.location
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'location',
                        e.target.value,
                      )
                    }
                  />

                </div>

                {/* DESCRIPCIÓN */}

                <div className="admin-form-group admin-form-full">

                  <label>
                    Descripción
                  </label>

                  <textarea
                    rows={3}
                    placeholder="Descripción del equipo..."
                    value={
                      formulario.description
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'description',
                        e.target.value,
                      )
                    }
                  />

                </div>

                {/* OBSERVACIONES */}

                <div className="admin-form-group admin-form-full">

                  <label>
                    Observaciones
                  </label>

                  <textarea
                    rows={3}
                    placeholder="Información adicional..."
                    value={
                      formulario.notes
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'notes',
                        e.target.value,
                      )
                    }
                  />

                </div>

              </div>

              {error && (
                <div className="admin-error-message">
                  {error}
                </div>
              )}

              <div className="admin-modal-footer">

                <button
                  type="button"
                  className="admin-cancel-button"
                  onClick={
                    cerrarFormulario
                  }
                  disabled={guardando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={guardando}
                >
                  {guardando
                    ? 'Guardando...'
                    : 'Guardar equipo'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}