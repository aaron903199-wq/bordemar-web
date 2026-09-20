import { FormEvent, useEffect, useState } from 'react'

interface Cliente {
  id: string
  businessName: string
  rut: string
  status: 'ACTIVE' | 'INACTIVE'
}

interface Nave {
  id: string
  name: string
  registration: string
  callSign?: string
  vesselType?: string
  status: 'ACTIVE' | 'INACTIVE'
  notes?: string
  clientId: string
  client: Cliente
}

interface FormNave {
  name: string
  registration: string
  callSign: string
  vesselType: string
  clientId: string
  notes: string
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

const formularioInicial: FormNave = {
  name: '',
  registration: '',
  callSign: '',
  vesselType: '',
  clientId: '',
  notes: '',
}

export default function NavesAdmin() {
  const [naves, setNaves] = useState<Nave[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false)

  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)

  const [busqueda, setBusqueda] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const [formulario, setFormulario] =
    useState<FormNave>(formularioInicial)

  const [naveSeleccionada, setNaveSeleccionada] = useState<Nave | null>(null)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [formularioEdicion, setFormularioEdicion] =
    useState<FormNave>(formularioInicial)
  const [procesandoEstado, setProcesandoEstado] = useState(false)

  // =========================================================
  // SESIÓN EXPIRADA / TOKEN INVÁLIDO
  // =========================================================

  const cerrarSesionPorTokenInvalido = () => {
    localStorage.removeItem(
      'bordemar_cert_token',
    )

    window.location.href = '/admin/login'
  }

  // =========================================================
  // CARGAR NAVES
  // =========================================================

  const cargarNaves = async () => {
    try {
      setCargando(true)
      setError('')

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
        'No fue posible conectar con el servidor de naves.',
      )
    } finally {
      setCargando(false)
    }
  }

  // =========================================================
  // CARGAR CLIENTES / ARMADORES
  // =========================================================

  const cargarClientes = async () => {
    try {
      const response = await fetch(
        `${API_URL}/clients`,
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
          'No fue posible cargar los clientes.',
        )
      }

      const data = await response.json()

      setClientes(
        Array.isArray(data) ? data : [],
      )
    } catch (err) {
      console.error(err)

      setError(
        'No fue posible cargar los clientes.',
      )
    }
  }

  // =========================================================
  // CARGA INICIAL
  // =========================================================

  useEffect(() => {
    cargarNaves()
    cargarClientes()
  }, [])

  // =========================================================
  // CAMBIOS DEL FORMULARIO
  // =========================================================

  const actualizarCampo = (
    campo: keyof FormNave,
    valor: string,
  ) => {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }))
  }

  // =========================================================
  // CERRAR FORMULARIO
  // =========================================================

  const cerrarFormulario = () => {
    if (guardando) {
      return
    }

    setMostrarFormulario(false)
    setFormulario(formularioInicial)
    setError('')
  }

  // =========================================================
  // CREAR NAVE
  // =========================================================

  const guardarNave = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()

    setError('')
    setMensaje('')

    if (
      !formulario.name.trim() ||
      !formulario.registration.trim() ||
      !formulario.clientId
    ) {
      setError(
        'Nombre, matrícula y cliente/armador son obligatorios.',
      )

      return
    }

    try {
      setGuardando(true)

      const response = await fetch(
        `${API_URL}/vessels`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },

          body: JSON.stringify({
            name: formulario.name.trim(),

            registration:
              formulario.registration.trim(),

            callSign:
              formulario.callSign.trim() ||
              undefined,

            vesselType:
              formulario.vesselType.trim() ||
              undefined,

            clientId:
              formulario.clientId,

            notes:
              formulario.notes.trim() ||
              undefined,
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
            'No fue posible registrar la nave.',
        )
      }

      setFormulario(formularioInicial)

      setMostrarFormulario(false)

      setMensaje(
        `Nave "${data.name}" registrada correctamente.`,
      )

      await cargarNaves()
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible registrar la nave.',
      )
    } finally {
      setGuardando(false)
    }
  }

  // =========================================================
  // EDITAR / ACTIVAR / DESACTIVAR NAVE
  // =========================================================

  const abrirEdicion = () => {
    if (!naveSeleccionada) return
    setError('')
    setMensaje('')
    setFormularioEdicion({
      name: naveSeleccionada.name ?? '',
      registration: naveSeleccionada.registration ?? '',
      callSign: naveSeleccionada.callSign ?? '',
      vesselType: naveSeleccionada.vesselType ?? '',
      clientId: naveSeleccionada.clientId ?? '',
      notes: naveSeleccionada.notes ?? '',
    })
    setModoEdicion(true)
  }

  const actualizarCampoEdicion = (campo: keyof FormNave, valor: string) => {
    setFormularioEdicion((actual) => ({ ...actual, [campo]: valor }))
  }

  const guardarEdicion = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!naveSeleccionada) return
    setError('')
    setMensaje('')

    if (!formularioEdicion.name.trim() || !formularioEdicion.registration.trim() || !formularioEdicion.clientId) {
      setError('Nombre, matrícula y cliente/armador son obligatorios.')
      return
    }

    try {
      setGuardando(true)
      const response = await fetch(`${API_URL}/vessels/${naveSeleccionada.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          name: formularioEdicion.name.trim(),
          registration: formularioEdicion.registration.trim(),
          callSign: formularioEdicion.callSign.trim() || undefined,
          vesselType: formularioEdicion.vesselType.trim() || undefined,
          clientId: formularioEdicion.clientId,
          notes: formularioEdicion.notes.trim() || undefined,
        }),
      })

      if (response.status === 401) {
        cerrarSesionPorTokenInvalido()
        return
      }

      const data = await response.json()
      if (!response.ok) {
        const msg = Array.isArray(data.message) ? data.message.join(', ') : data.message
        throw new Error(msg || 'No fue posible actualizar la nave.')
      }

      setNaveSeleccionada(data)
      setModoEdicion(false)
      setFormularioEdicion(formularioInicial)
      setMensaje(`Nave "${data.name}" actualizada correctamente.`)
      await cargarNaves()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible actualizar la nave.')
    } finally {
      setGuardando(false)
    }
  }

  const cambiarEstadoNave = async (accion: 'activate' | 'deactivate') => {
    if (!naveSeleccionada) return
    const activar = accion === 'activate'
    const verbo = activar ? 'activar' : 'desactivar'
    if (!window.confirm(`¿Deseas ${verbo} la nave "${naveSeleccionada.name}"?`)) return

    try {
      setProcesandoEstado(true)
      setError('')
      setMensaje('')
      const response = await fetch(`${API_URL}/vessels/${naveSeleccionada.id}/${accion}`, {
        method: 'PATCH',
        headers: { ...getAuthHeaders() },
      })

      if (response.status === 401) {
        cerrarSesionPorTokenInvalido()
        return
      }

      const data = await response.json()
      if (!response.ok) {
        const msg = Array.isArray(data.message) ? data.message.join(', ') : data.message
        throw new Error(msg || `No fue posible ${verbo} la nave.`)
      }

      setNaveSeleccionada(data)
      setMensaje(activar ? `Nave "${data.name}" activada correctamente.` : `Nave "${data.name}" desactivada correctamente.`)
      await cargarNaves()
    } catch (err) {
      setError(err instanceof Error ? err.message : `No fue posible ${verbo} la nave.`)
    } finally {
      setProcesandoEstado(false)
    }
  }

  // =========================================================
  // FILTRO
  // =========================================================

  const navesFiltradas = naves.filter(
    (nave) => {
      const texto =
        busqueda.trim().toLowerCase()

      return (
        nave.name
          .toLowerCase()
          .includes(texto) ||
        nave.registration
          .toLowerCase()
          .includes(texto) ||
        (nave.callSign ?? '')
          .toLowerCase()
          .includes(texto) ||
        (nave.client?.businessName ?? '')
          .toLowerCase()
          .includes(texto)
      )
    },
  )

  return (
    <div className="admin-naves">

      {/* =====================================================
          ENCABEZADO
         ===================================================== */}

      <div className="admin-page-header">

        <div>

          <span className="admin-eyebrow">
            GESTIÓN
          </span>

          <h1>
            Naves
          </h1>

          <p>
            Registro de embarcaciones asociadas
            a los clientes.
          </p>

        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={() => {
            setError('')
            setMensaje('')
            setMostrarFormulario(true)
          }}
        >
          + Nueva nave
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
              placeholder="Buscar por nave, matrícula, señal o armador..."
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
            />

          </div>

          <div className="admin-clientes-count">

            <span>
              Total naves
            </span>

            <strong>
              {naves.length}
            </strong>

          </div>

        </div>

        <div className="admin-table-wrapper">

          <table className="admin-table">

            <thead>

              <tr>
                <th>Nave</th>
                <th>Matrícula</th>
                <th>Señal llamada</th>
                <th>Tipo</th>
                <th>Cliente / Armador</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>

            </thead>

            <tbody>

              {/* =================================================
                  CARGANDO
                 ================================================= */}

              {cargando ? (

                <tr>

                  <td colSpan={7}>

                    <div className="admin-table-empty">

                      <p>
                        Cargando naves...
                      </p>

                    </div>

                  </td>

                </tr>

              ) : navesFiltradas.length === 0 ? (

                /* ===============================================
                   SIN NAVES
                   =============================================== */

                <tr className="admin-table-empty-row">

                  <td colSpan={7}>

                    <div className="admin-table-empty">

                      <div className="admin-empty-icon">
                        ⚓
                      </div>

                      <h3>
                        No existen naves registradas
                      </h3>

                      <p>
                        Registra una embarcación para
                        comenzar a asociar equipos y
                        certificados.
                      </p>

                      <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={() => {
                          setError('')
                          setMensaje('')
                          setMostrarFormulario(
                            true,
                          )
                        }}
                      >
                        + Registrar primera nave
                      </button>

                    </div>

                  </td>

                </tr>

              ) : (

                /* ===============================================
                   NAVES REGISTRADAS
                   =============================================== */

                navesFiltradas.map(
                  (nave) => (

                    <tr key={nave.id}>

                      <td>
                        <strong>
                          {nave.name}
                        </strong>
                      </td>

                      <td>
                        {nave.registration}
                      </td>

                      <td>
                        {nave.callSign || '—'}
                      </td>

                      <td>
                        {nave.vesselType || '—'}
                      </td>

                      <td>
                        {nave.client
                          ?.businessName ||
                          '—'}
                      </td>

                      <td>

                        <span
                          className={
                            nave.status ===
                            'ACTIVE'
                              ? 'admin-status admin-status-active'
                              : 'admin-status admin-status-inactive'
                          }
                        >
                          {nave.status ===
                          'ACTIVE'
                            ? 'ACTIVO'
                            : 'INACTIVO'}
                        </span>

                      </td>

                      <td>

                        <button
                          type="button"
                          className="admin-table-action"
                          onClick={() => {
                            setError('')
                            setMensaje('')
                            setModoEdicion(false)
                            setNaveSeleccionada(nave)
                          }}
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
          MODAL DETALLE / EDICIÓN DE NAVE
         ===================================================== */}

      {naveSeleccionada && (
        <div
          className="admin-modal-overlay"
          onMouseDown={() => {
            if (!guardando && !procesandoEstado) {
              setNaveSeleccionada(null)
              setModoEdicion(false)
              setError('')
            }
          }}
        >
          <div className="admin-modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <span className="admin-eyebrow">BORDEMAR CERT</span>
                <h2>{modoEdicion ? 'Editar nave' : naveSeleccionada.name}</h2>
                <p>{modoEdicion ? 'Actualiza los datos de la embarcación.' : 'Ficha de la embarcación registrada.'}</p>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                disabled={guardando || procesandoEstado}
                onClick={() => {
                  setNaveSeleccionada(null)
                  setModoEdicion(false)
                  setError('')
                }}
              >×</button>
            </div>

            {modoEdicion ? (
              <form onSubmit={guardarEdicion}>
                <div className="admin-form-grid">
                  <div className="admin-form-group admin-form-full">
                    <label>Cliente / Armador <span>*</span></label>
                    <select
                      value={formularioEdicion.clientId}
                      onChange={(e) => actualizarCampoEdicion('clientId', e.target.value)}
                      required
                    >
                      <option value="">Seleccionar cliente o armador</option>
                      {clientes
                        .filter((cliente) => cliente.status === 'ACTIVE' || cliente.id === formularioEdicion.clientId)
                        .map((cliente) => (
                          <option key={cliente.id} value={cliente.id}>
                            {cliente.businessName} — {cliente.rut}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Nombre de la nave <span>*</span></label>
                    <input type="text" value={formularioEdicion.name}
                      onChange={(e) => actualizarCampoEdicion('name', e.target.value)} required />
                  </div>

                  <div className="admin-form-group">
                    <label>Matrícula <span>*</span></label>
                    <input type="text" value={formularioEdicion.registration}
                      onChange={(e) => actualizarCampoEdicion('registration', e.target.value)} required />
                  </div>

                  <div className="admin-form-group">
                    <label>Señal de llamada</label>
                    <input type="text" value={formularioEdicion.callSign}
                      onChange={(e) => actualizarCampoEdicion('callSign', e.target.value)} />
                  </div>

                  <div className="admin-form-group">
                    <label>Tipo de nave</label>
                    <select value={formularioEdicion.vesselType}
                      onChange={(e) => actualizarCampoEdicion('vesselType', e.target.value)}>
                      <option value="">Seleccionar tipo</option>
                      <option value="Barcaza">Barcaza</option>
                      <option value="Lancha">Lancha</option>
                      <option value="Lancha de pasajeros">Lancha de pasajeros</option>
                      <option value="Lancha de servicio">Lancha de servicio</option>
                      <option value="Remolcador">Remolcador</option>
                      <option value="Pontón">Pontón</option>
                      <option value="Artefacto naval">Artefacto naval</option>
                      <option value="Otra">Otra</option>
                    </select>
                  </div>

                  <div className="admin-form-group admin-form-full">
                    <label>Observaciones</label>
                    <textarea rows={4} value={formularioEdicion.notes}
                      onChange={(e) => actualizarCampoEdicion('notes', e.target.value)} />
                  </div>
                </div>

                {error && <div className="admin-error-message">{error}</div>}

                <div className="admin-modal-footer">
                  <button type="button" className="admin-cancel-button"
                    onClick={() => { setModoEdicion(false); setError('') }} disabled={guardando}>
                    Cancelar
                  </button>
                  <button type="submit" className="admin-primary-button" disabled={guardando}>
                    {guardando ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label>Estado</label>
                    <div>
                      <span className={naveSeleccionada.status === 'ACTIVE'
                        ? 'admin-status admin-status-active'
                        : 'admin-status admin-status-inactive'}>
                        {naveSeleccionada.status === 'ACTIVE' ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Tipo de nave</label>
                    <div>{naveSeleccionada.vesselType || '—'}</div>
                  </div>

                  <div className="admin-form-group">
                    <label>Matrícula</label>
                    <div><strong>{naveSeleccionada.registration}</strong></div>
                  </div>

                  <div className="admin-form-group">
                    <label>Señal de llamada</label>
                    <div>{naveSeleccionada.callSign || '—'}</div>
                  </div>

                  <div className="admin-form-group admin-form-full">
                    <label>Cliente / Armador</label>
                    <div>
                      <strong>{naveSeleccionada.client?.businessName || '—'}</strong>
                      {naveSeleccionada.client?.rut && (
                        <div style={{ fontSize: '12px', opacity: 0.65, marginTop: '4px' }}>
                          RUT {naveSeleccionada.client.rut}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="admin-form-group admin-form-full">
                    <label>Observaciones</label>
                    <div>{naveSeleccionada.notes || 'Sin observaciones registradas.'}</div>
                  </div>
                </div>

                {error && <div className="admin-error-message">{error}</div>}

                <div className="admin-modal-footer">
                  <button type="button" className="admin-secondary-button"
                    onClick={abrirEdicion} disabled={procesandoEstado}>
                    Editar nave
                  </button>

                  {naveSeleccionada.status === 'ACTIVE' ? (
                    <button type="button" className="admin-cancel-button"
                      onClick={() => cambiarEstadoNave('deactivate')} disabled={procesandoEstado}>
                      {procesandoEstado ? 'Procesando...' : 'Desactivar nave'}
                    </button>
                  ) : (
                    <button type="button" className="admin-secondary-button"
                      onClick={() => cambiarEstadoNave('activate')} disabled={procesandoEstado}>
                      {procesandoEstado ? 'Procesando...' : 'Activar nave'}
                    </button>
                  )}

                  <button type="button" className="admin-primary-button"
                    onClick={() => { setNaveSeleccionada(null); setError('') }}
                    disabled={procesandoEstado}>
                    Cerrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          MODAL NUEVA NAVE
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

            {/* =================================================
                CABECERA MODAL
               ================================================= */}

            <div className="admin-modal-header">

              <div>

                <span className="admin-eyebrow">
                  BORDEMAR CERT
                </span>

                <h2>
                  Nueva nave
                </h2>

                <p>
                  Registra una embarcación y
                  asóciala a su cliente o armador.
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

            {/* =================================================
                FORMULARIO
               ================================================= */}

            <form onSubmit={guardarNave}>

              <div className="admin-form-grid">

                {/* =============================================
                    CLIENTE / ARMADOR
                   ============================================= */}

                <div className="admin-form-group admin-form-full">

                  <label>
                    Cliente / Armador
                    <span>*</span>
                  </label>

                  <select
                    value={
                      formulario.clientId
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'clientId',
                        e.target.value,
                      )
                    }
                    required
                  >

                    <option value="">
                      Seleccionar cliente o armador
                    </option>

                    {clientes
                      .filter(
                        (cliente) =>
                          cliente.status ===
                          'ACTIVE',
                      )
                      .map(
                        (cliente) => (

                          <option
                            key={cliente.id}
                            value={cliente.id}
                          >
                            {
                              cliente.businessName
                            }{' '}
                            — {cliente.rut}
                          </option>

                        ),
                      )}

                  </select>

                </div>

                {/* =============================================
                    NOMBRE
                   ============================================= */}

                <div className="admin-form-group">

                  <label>
                    Nombre de la nave
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Ej: DON ENRIQUE"
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

                {/* =============================================
                    MATRÍCULA
                   ============================================= */}

                <div className="admin-form-group">

                  <label>
                    Matrícula
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Ej: CALBUCO 5058"
                    value={
                      formulario.registration
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'registration',
                        e.target.value,
                      )
                    }
                    required
                  />

                </div>

                {/* =============================================
                    SEÑAL DE LLAMADA
                   ============================================= */}

                <div className="admin-form-group">

                  <label>
                    Señal de llamada
                  </label>

                  <input
                    type="text"
                    placeholder="Ej: CA8290"
                    value={
                      formulario.callSign
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'callSign',
                        e.target.value,
                      )
                    }
                  />

                </div>

                {/* =============================================
                    TIPO DE NAVE
                   ============================================= */}

                <div className="admin-form-group">

                  <label>
                    Tipo de nave
                  </label>

                  <select
                    value={
                      formulario.vesselType
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'vesselType',
                        e.target.value,
                      )
                    }
                  >

                    <option value="">
                      Seleccionar tipo
                    </option>

                    <option value="Barcaza">
                      Barcaza
                    </option>

                    <option value="Lancha">
                      Lancha
                    </option>

                    <option value="Lancha de pasajeros">
                      Lancha de pasajeros
                    </option>

                    <option value="Lancha de servicio">
                      Lancha de servicio
                    </option>

                    <option value="Remolcador">
                      Remolcador
                    </option>

                    <option value="Pontón">
                      Pontón
                    </option>

                    <option value="Artefacto naval">
                      Artefacto naval
                    </option>

                    <option value="Otra">
                      Otra
                    </option>

                  </select>

                </div>

                {/* =============================================
                    OBSERVACIONES
                   ============================================= */}

                <div className="admin-form-group admin-form-full">

                  <label>
                    Observaciones
                  </label>

                  <textarea
                    rows={4}
                    placeholder="Información adicional de la nave..."
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

              {/* =================================================
                  ERROR DEL FORMULARIO
                 ================================================= */}

              {error && (
                <div className="admin-error-message">
                  {error}
                </div>
              )}

              {/* =================================================
                  BOTONES
                 ================================================= */}

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
                    : 'Guardar nave'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}