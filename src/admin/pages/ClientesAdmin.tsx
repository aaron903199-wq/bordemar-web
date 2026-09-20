import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from 'react'

const API_URL =
  import.meta.env.VITE_CERT_API_URL ||
  'http://localhost:3000'

// =========================================================
// AUTENTICACIÓN
// =========================================================

const getAuthHeaders = () => {
  const token = localStorage.getItem(
    'bordemar_cert_token',
  )

  return {
    Authorization: `Bearer ${token ?? ''}`,
  }
}

// =========================================================
// TIPOS
// =========================================================

interface Cliente {
  id: string
  businessName: string
  rut: string
  contactName: string | null
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  region: string | null
  notes: string | null
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
}

interface NuevoCliente {
  businessName: string
  rut: string
  contactName: string
  email: string
  phone: string
  address: string
  city: string
  region: string
  notes: string
}

// =========================================================
// FORMULARIO INICIAL
// =========================================================

const formularioInicial: NuevoCliente = {
  businessName: '',
  rut: '',
  contactName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  region: '',
  notes: '',
}

// =========================================================
// COMPONENTE
// =========================================================

export default function ClientesAdmin() {
  const [clientes, setClientes] = useState<Cliente[]>([])

  const [
    mostrarFormulario,
    setMostrarFormulario,
  ] = useState(false)

  const [busqueda, setBusqueda] = useState('')

  const [formulario, setFormulario] =
    useState<NuevoCliente>(formularioInicial)

  const [cargando, setCargando] = useState(true)

  const [guardando, setGuardando] =
    useState(false)

  const [error, setError] = useState('')

  const [mensaje, setMensaje] = useState('')

  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null)

  const [modoEdicion, setModoEdicion] =
    useState(false)

  const [formularioEdicion, setFormularioEdicion] =
    useState<NuevoCliente>(formularioInicial)

  const [procesandoEstado, setProcesandoEstado] =
    useState(false)

  // =========================================================
  // MANEJAR SESIÓN EXPIRADA
  // =========================================================

  const cerrarSesionPorTokenInvalido = () => {
    localStorage.removeItem(
      'bordemar_cert_token',
    )

    window.location.href = '/admin/login'
  }

  // =========================================================
  // CARGAR CLIENTES
  // =========================================================

  const cargarClientes = async () => {
    try {
      setCargando(true)
      setError('')

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
          `No fue posible cargar los clientes. Código ${response.status}`,
        )
      }

      const data: Cliente[] =
        await response.json()

      setClientes(
        Array.isArray(data) ? data : [],
      )
    } catch (err) {
      console.error(
        'Error cargando clientes:',
        err,
      )

      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(
          'No fue posible conectar con BORDEMAR CERT API.',
        )
      }
    } finally {
      setCargando(false)
    }
  }

  // =========================================================
  // CARGA INICIAL
  // =========================================================

  useEffect(() => {
    cargarClientes()
  }, [])

  // =========================================================
  // BUSCADOR
  // =========================================================

  const clientesFiltrados = useMemo(() => {
    const texto =
      busqueda.trim().toLowerCase()

    if (!texto) {
      return clientes
    }

    return clientes.filter((cliente) => {
      return (
        cliente.businessName
          .toLowerCase()
          .includes(texto) ||
        cliente.rut
          .toLowerCase()
          .includes(texto) ||
        (cliente.contactName ?? '')
          .toLowerCase()
          .includes(texto) ||
        (cliente.email ?? '')
          .toLowerCase()
          .includes(texto) ||
        (cliente.phone ?? '')
          .toLowerCase()
          .includes(texto)
      )
    })
  }, [clientes, busqueda])

  // =========================================================
  // ACTUALIZAR FORMULARIO
  // =========================================================

  const actualizarCampo = (
    campo: keyof NuevoCliente,
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
  // GUARDAR CLIENTE
  // =========================================================

  const guardarCliente = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()

    if (!formulario.businessName.trim()) {
      setError(
        'Debes ingresar la razón social.',
      )
      return
    }

    if (!formulario.rut.trim()) {
      setError('Debes ingresar el RUT.')
      return
    }

    try {
      setGuardando(true)
      setError('')
      setMensaje('')

      const payload = {
        businessName:
          formulario.businessName.trim(),

        rut: formulario.rut.trim(),

        contactName:
          formulario.contactName.trim() ||
          undefined,

        email:
          formulario.email.trim() ||
          undefined,

        phone:
          formulario.phone.trim() ||
          undefined,

        address:
          formulario.address.trim() ||
          undefined,

        city:
          formulario.city.trim() ||
          undefined,

        region:
          formulario.region.trim() ||
          undefined,

        notes:
          formulario.notes.trim() ||
          undefined,
      }

      const response = await fetch(
        `${API_URL}/clients`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            ...getAuthHeaders(),
          },

          body: JSON.stringify(payload),
        },
      )

      // =====================================================
      // TOKEN EXPIRADO
      // =====================================================

      if (response.status === 401) {
        cerrarSesionPorTokenInvalido()
        return
      }

      // =====================================================
      // ERROR API
      // =====================================================

      if (!response.ok) {
        let detalle = ''

        try {
          const data =
            await response.json()

          if (
            typeof data?.message ===
            'string'
          ) {
            detalle = data.message
          } else if (
            Array.isArray(
              data?.message,
            )
          ) {
            detalle =
              data.message.join(', ')
          }
        } catch {
          // El backend no devolvió JSON.
        }

        throw new Error(
          detalle ||
            `No fue posible guardar el cliente (${response.status}).`,
        )
      }

      // =====================================================
      // CLIENTE CREADO
      // =====================================================

      const clienteCreado: Cliente =
        await response.json()

      setClientes((actuales) => [
        clienteCreado,

        ...actuales.filter(
          (cliente) =>
            cliente.id !==
            clienteCreado.id,
        ),
      ])

      setFormulario(formularioInicial)

      setMostrarFormulario(false)

      setMensaje(
        `Cliente "${clienteCreado.businessName}" registrado correctamente.`,
      )

      // =====================================================
      // SINCRONIZAR CON POSTGRESQL
      // =====================================================

      await cargarClientes()
    } catch (err) {
      console.error(
        'Error guardando cliente:',
        err,
      )

      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(
          'Ocurrió un error al guardar el cliente.',
        )
      }
    } finally {
      setGuardando(false)
    }
  }

  // =========================================================
  // EDITAR CLIENTE
  // =========================================================

  const abrirEdicion = () => {
    if (!clienteSeleccionado) return

    setError('')
    setMensaje('')

    setFormularioEdicion({
      businessName: clienteSeleccionado.businessName ?? '',
      rut: clienteSeleccionado.rut ?? '',
      contactName: clienteSeleccionado.contactName ?? '',
      email: clienteSeleccionado.email ?? '',
      phone: clienteSeleccionado.phone ?? '',
      address: clienteSeleccionado.address ?? '',
      city: clienteSeleccionado.city ?? '',
      region: clienteSeleccionado.region ?? '',
      notes: clienteSeleccionado.notes ?? '',
    })

    setModoEdicion(true)
  }

  const actualizarCampoEdicion = (
    campo: keyof NuevoCliente,
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

    if (!clienteSeleccionado) return

    if (!formularioEdicion.businessName.trim()) {
      setError('Debes ingresar la razón social.')
      return
    }

    if (!formularioEdicion.rut.trim()) {
      setError('Debes ingresar el RUT.')
      return
    }

    try {
      setGuardando(true)
      setError('')
      setMensaje('')

      const response = await fetch(
        `${API_URL}/clients/${clienteSeleccionado.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            businessName:
              formularioEdicion.businessName.trim(),
            rut: formularioEdicion.rut.trim(),
            contactName:
              formularioEdicion.contactName.trim() || undefined,
            email:
              formularioEdicion.email.trim() || undefined,
            phone:
              formularioEdicion.phone.trim() || undefined,
            address:
              formularioEdicion.address.trim() || undefined,
            city:
              formularioEdicion.city.trim() || undefined,
            region:
              formularioEdicion.region.trim() || undefined,
            notes:
              formularioEdicion.notes.trim() || undefined,
          }),
        },
      )

      if (response.status === 401) {
        cerrarSesionPorTokenInvalido()
        return
      }

      const data = await response.json()

      if (!response.ok) {
        const detalle =
          Array.isArray(data?.message)
            ? data.message.join(', ')
            : data?.message

        throw new Error(
          detalle ||
            'No fue posible actualizar el cliente.',
        )
      }

      setClienteSeleccionado(data)
      setModoEdicion(false)
      setFormularioEdicion(formularioInicial)

      setMensaje(
        `Cliente "${data.businessName}" actualizado correctamente.`,
      )

      await cargarClientes()
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible actualizar el cliente.',
      )
    } finally {
      setGuardando(false)
    }
  }

  // =========================================================
  // ACTIVAR / DESACTIVAR CLIENTE
  // =========================================================

  const cambiarEstadoCliente = async (
    accion: 'activate' | 'deactivate',
  ) => {
    if (!clienteSeleccionado) return

    const activar = accion === 'activate'
    const verbo = activar ? 'activar' : 'desactivar'

    if (
      !window.confirm(
        `¿Deseas ${verbo} el cliente "${clienteSeleccionado.businessName}"?`,
      )
    ) {
      return
    }

    try {
      setProcesandoEstado(true)
      setError('')
      setMensaje('')

      const response = await fetch(
        `${API_URL}/clients/${clienteSeleccionado.id}/${accion}`,
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
        const detalle =
          Array.isArray(data?.message)
            ? data.message.join(', ')
            : data?.message

        throw new Error(
          detalle ||
            `No fue posible ${verbo} el cliente.`,
        )
      }

      setClienteSeleccionado(data)

      setMensaje(
        activar
          ? `Cliente "${data.businessName}" activado correctamente.`
          : `Cliente "${data.businessName}" desactivado correctamente.`,
      )

      await cargarClientes()
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : `No fue posible ${verbo} el cliente.`,
      )
    } finally {
      setProcesandoEstado(false)
    }
  }

  // =========================================================
  // INTERFAZ
  // =========================================================

  return (
    <div className="admin-clientes">

      {/* =====================================================
          ENCABEZADO
         ===================================================== */}

      <div className="admin-page-header">

        <div>

          <span className="admin-eyebrow">
            GESTIÓN
          </span>

          <h1>
            Clientes
          </h1>

          <p>
            Empresas y armadores registrados
            en BORDEMAR CERT.
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
          + Nuevo cliente
        </button>

      </div>

      {/* =====================================================
          MENSAJES
         ===================================================== */}

      {mensaje && (
        <div className="admin-alert admin-alert-success">
          {mensaje}
        </div>
      )}

      {error && !mostrarFormulario && (
        <div className="admin-alert admin-alert-error">
          {error}
        </div>
      )}

      {/* =====================================================
          PANEL CLIENTES
         ===================================================== */}

      <section className="admin-panel admin-clientes-panel">

        {/* ===================================================
            HERRAMIENTAS
           =================================================== */}

        <div className="admin-clientes-toolbar">

          <div className="admin-search-box">

            <span>
              ⌕
            </span>

            <input
              type="text"
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
              placeholder="Buscar por razón social, RUT o contacto..."
            />

          </div>

          <div className="admin-clientes-count">

            <span>
              Total clientes
            </span>

            <strong>
              {clientes.length}
            </strong>

          </div>

        </div>

        {/* ===================================================
            TABLA
           =================================================== */}

        <div className="admin-table-wrapper">

          <table className="admin-table">

            <thead>

              <tr>
                <th>Razón social</th>
                <th>RUT</th>
                <th>Contacto</th>
                <th>Teléfono</th>
                <th>Naves</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>

            </thead>

            <tbody>

              {/* =================================================
                  CARGANDO
                 ================================================= */}

              {cargando && (

                <tr className="admin-table-empty-row">

                  <td colSpan={7}>

                    <div className="admin-table-empty">

                      <div className="admin-empty-icon">
                        ◌
                      </div>

                      <h3>
                        Cargando clientes...
                      </h3>

                      <p>
                        Consultando BORDEMAR CERT.
                      </p>

                    </div>

                  </td>

                </tr>

              )}

              {/* =================================================
                  SIN CLIENTES
                 ================================================= */}

              {!cargando &&
                clientes.length === 0 && (

                  <tr className="admin-table-empty-row">

                    <td colSpan={7}>

                      <div className="admin-table-empty">

                        <div className="admin-empty-icon">
                          ▣
                        </div>

                        <h3>
                          No existen clientes registrados
                        </h3>

                        <p>
                          Registra tu primer cliente
                          para comenzar a asociar
                          naves, equipos y
                          certificados.
                        </p>

                        <button
                          type="button"
                          className="admin-secondary-button"
                          onClick={() =>
                            setMostrarFormulario(
                              true,
                            )
                          }
                        >
                          + Registrar primer cliente
                        </button>

                      </div>

                    </td>

                  </tr>

                )}

              {/* =================================================
                  SIN RESULTADOS
                 ================================================= */}

              {!cargando &&
                clientes.length > 0 &&
                clientesFiltrados.length ===
                  0 && (

                  <tr className="admin-table-empty-row">

                    <td colSpan={7}>

                      <div className="admin-table-empty">

                        <div className="admin-empty-icon">
                          ⌕
                        </div>

                        <h3>
                          No encontramos resultados
                        </h3>

                        <p>
                          No existen clientes que
                          coincidan con "
                          {busqueda}".
                        </p>

                      </div>

                    </td>

                  </tr>

                )}

              {/* =================================================
                  CLIENTES
                 ================================================= */}

              {!cargando &&
                clientesFiltrados.map(
                  (cliente) => (

                    <tr key={cliente.id}>

                      <td>

                        <strong>
                          {
                            cliente.businessName
                          }
                        </strong>

                      </td>

                      <td>
                        {cliente.rut}
                      </td>

                      <td>
                        {cliente.contactName ||
                          '—'}
                      </td>

                      <td>
                        {cliente.phone || '—'}
                      </td>

                      <td>
                        0
                      </td>

                      <td>

                        <span
                          className={
                            cliente.status ===
                            'ACTIVE'
                              ? 'admin-status admin-status-active'
                              : 'admin-status admin-status-inactive'
                          }
                        >
                          {cliente.status ===
                          'ACTIVE'
                            ? 'ACTIVO'
                            : 'INACTIVO'}
                        </span>

                      </td>

                      <td>

                        <button
                          type="button"
                          className="admin-text-button"
                          onClick={() => {
                            setError('')
                            setMensaje('')
                            setModoEdicion(false)
                            setClienteSeleccionado(cliente)
                          }}
                        >
                          Ver
                        </button>

                      </td>

                    </tr>

                  ),
                )}

            </tbody>

          </table>

        </div>

      </section>

      {/* =====================================================
          MODAL DETALLE / EDICIÓN CLIENTE
         ===================================================== */}

      {clienteSeleccionado && (
        <div
          className="admin-modal-overlay"
          onMouseDown={() => {
            if (!guardando && !procesandoEstado) {
              setClienteSeleccionado(null)
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
                    ? 'Editar cliente'
                    : clienteSeleccionado.businessName}
                </h2>

                <p>
                  {modoEdicion
                    ? 'Actualiza los datos de la empresa o armador.'
                    : 'Ficha del cliente o armador registrado.'}
                </p>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                disabled={guardando || procesandoEstado}
                onClick={() => {
                  setClienteSeleccionado(null)
                  setModoEdicion(false)
                  setError('')
                }}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            {modoEdicion ? (
              <form onSubmit={guardarEdicion}>
                {error && (
                  <div className="admin-alert admin-alert-error">
                    {error}
                  </div>
                )}

                <div className="admin-form-grid">
                  <div className="admin-form-group admin-form-full">
                    <label>
                      Razón social
                      <span>*</span>
                    </label>
                    <input
                      type="text"
                      value={formularioEdicion.businessName}
                      onChange={(e) =>
                        actualizarCampoEdicion(
                          'businessName',
                          e.target.value,
                        )
                      }
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>
                      RUT
                      <span>*</span>
                    </label>
                    <input
                      type="text"
                      value={formularioEdicion.rut}
                      onChange={(e) =>
                        actualizarCampoEdicion(
                          'rut',
                          e.target.value,
                        )
                      }
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Nombre de contacto</label>
                    <input
                      type="text"
                      value={formularioEdicion.contactName}
                      onChange={(e) =>
                        actualizarCampoEdicion(
                          'contactName',
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Correo electrónico</label>
                    <input
                      type="email"
                      value={formularioEdicion.email}
                      onChange={(e) =>
                        actualizarCampoEdicion(
                          'email',
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Teléfono</label>
                    <input
                      type="tel"
                      value={formularioEdicion.phone}
                      onChange={(e) =>
                        actualizarCampoEdicion(
                          'phone',
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Ciudad</label>
                    <input
                      type="text"
                      value={formularioEdicion.city}
                      onChange={(e) =>
                        actualizarCampoEdicion(
                          'city',
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Región</label>
                    <select
                      value={formularioEdicion.region}
                      onChange={(e) =>
                        actualizarCampoEdicion(
                          'region',
                          e.target.value,
                        )
                      }
                    >
                      <option value="">Seleccionar región</option>
                      <option value="Arica y Parinacota">Arica y Parinacota</option>
                      <option value="Tarapacá">Tarapacá</option>
                      <option value="Antofagasta">Antofagasta</option>
                      <option value="Atacama">Atacama</option>
                      <option value="Coquimbo">Coquimbo</option>
                      <option value="Valparaíso">Valparaíso</option>
                      <option value="Metropolitana de Santiago">Metropolitana de Santiago</option>
                      <option value="O'Higgins">O'Higgins</option>
                      <option value="Maule">Maule</option>
                      <option value="Ñuble">Ñuble</option>
                      <option value="Biobío">Biobío</option>
                      <option value="La Araucanía">La Araucanía</option>
                      <option value="Los Ríos">Los Ríos</option>
                      <option value="Los Lagos">Los Lagos</option>
                      <option value="Aysén">Aysén</option>
                      <option value="Magallanes">Magallanes</option>
                    </select>
                  </div>

                  <div className="admin-form-group admin-form-full">
                    <label>Dirección</label>
                    <input
                      type="text"
                      value={formularioEdicion.address}
                      onChange={(e) =>
                        actualizarCampoEdicion(
                          'address',
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="admin-form-group admin-form-full">
                    <label>Observaciones</label>
                    <textarea
                      rows={4}
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

                <div className="admin-modal-footer">
                  <button
                    type="button"
                    className="admin-cancel-button"
                    disabled={guardando}
                    onClick={() => {
                      setModoEdicion(false)
                      setError('')
                    }}
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
                          clienteSeleccionado.status === 'ACTIVE'
                            ? 'admin-status admin-status-active'
                            : 'admin-status admin-status-inactive'
                        }
                      >
                        {clienteSeleccionado.status === 'ACTIVE'
                          ? 'ACTIVO'
                          : 'INACTIVO'}
                      </span>
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>RUT</label>
                    <div>
                      <strong>{clienteSeleccionado.rut}</strong>
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Contacto</label>
                    <div>
                      {clienteSeleccionado.contactName || '—'}
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Teléfono</label>
                    <div>
                      {clienteSeleccionado.phone || '—'}
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Correo electrónico</label>
                    <div>
                      {clienteSeleccionado.email || '—'}
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Ciudad / Región</label>
                    <div>
                      {[clienteSeleccionado.city, clienteSeleccionado.region]
                        .filter(Boolean)
                        .join(' — ') || '—'}
                    </div>
                  </div>

                  <div className="admin-form-group admin-form-full">
                    <label>Dirección</label>
                    <div>
                      {clienteSeleccionado.address || '—'}
                    </div>
                  </div>

                  <div className="admin-form-group admin-form-full">
                    <label>Observaciones</label>
                    <div>
                      {clienteSeleccionado.notes ||
                        'Sin observaciones registradas.'}
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="admin-alert admin-alert-error">
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
                    Editar cliente
                  </button>

                  {clienteSeleccionado.status === 'ACTIVE' ? (
                    <button
                      type="button"
                      className="admin-cancel-button"
                      onClick={() =>
                        cambiarEstadoCliente('deactivate')
                      }
                      disabled={procesandoEstado}
                    >
                      {procesandoEstado
                        ? 'Procesando...'
                        : 'Desactivar cliente'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="admin-secondary-button"
                      onClick={() =>
                        cambiarEstadoCliente('activate')
                      }
                      disabled={procesandoEstado}
                    >
                      {procesandoEstado
                        ? 'Procesando...'
                        : 'Activar cliente'}
                    </button>
                  )}

                  <button
                    type="button"
                    className="admin-primary-button"
                    disabled={procesandoEstado}
                    onClick={() => {
                      setClienteSeleccionado(null)
                      setError('')
                    }}
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
          MODAL NUEVO CLIENTE
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
                  Nuevo cliente
                </h2>

                <p>
                  Registra una empresa o
                  armador en el sistema.
                </p>

              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={
                  cerrarFormulario
                }
                aria-label="Cerrar"
                disabled={guardando}
              >
                ×
              </button>

            </div>

            {/* =================================================
                FORMULARIO
               ================================================= */}

            <form
              onSubmit={
                guardarCliente
              }
            >

              {error && (

                <div className="admin-alert admin-alert-error">
                  {error}
                </div>

              )}

              <div className="admin-form-grid">

                {/* =============================================
                    RAZÓN SOCIAL
                   ============================================= */}

                <div className="admin-form-group admin-form-full">

                  <label>
                    Razón social
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    value={
                      formulario.businessName
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'businessName',
                        e.target.value,
                      )
                    }
                    placeholder="Ej: Naviera Ejemplo SPA"
                    required
                  />

                </div>

                {/* =============================================
                    RUT
                   ============================================= */}

                <div className="admin-form-group">

                  <label>
                    RUT
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    value={
                      formulario.rut
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'rut',
                        e.target.value,
                      )
                    }
                    placeholder="76.123.456-7"
                    required
                  />

                </div>

                {/* =============================================
                    CONTACTO
                   ============================================= */}

                <div className="admin-form-group">

                  <label>
                    Nombre de contacto
                  </label>

                  <input
                    type="text"
                    value={
                      formulario.contactName
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'contactName',
                        e.target.value,
                      )
                    }
                    placeholder="Nombre del contacto"
                  />

                </div>

                {/* =============================================
                    EMAIL
                   ============================================= */}

                <div className="admin-form-group">

                  <label>
                    Correo electrónico
                  </label>

                  <input
                    type="email"
                    value={
                      formulario.email
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'email',
                        e.target.value,
                      )
                    }
                    placeholder="contacto@empresa.cl"
                  />

                </div>

                {/* =============================================
                    TELÉFONO
                   ============================================= */}

                <div className="admin-form-group">

                  <label>
                    Teléfono
                  </label>

                  <input
                    type="tel"
                    value={
                      formulario.phone
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'phone',
                        e.target.value,
                      )
                    }
                    placeholder="+56 9 1234 5678"
                  />

                </div>

                {/* =============================================
                    CIUDAD
                   ============================================= */}

                <div className="admin-form-group">

                  <label>
                    Ciudad
                  </label>

                  <input
                    type="text"
                    value={
                      formulario.city
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'city',
                        e.target.value,
                      )
                    }
                    placeholder="Puerto Montt"
                  />

                </div>

                {/* =============================================
                    REGIÓN
                   ============================================= */}

                <div className="admin-form-group">

                  <label>
                    Región
                  </label>

                  <select
                    value={
                      formulario.region
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'region',
                        e.target.value,
                      )
                    }
                  >

                    <option value="">
                      Seleccionar región
                    </option>

                    <option value="Arica y Parinacota">
                      Arica y Parinacota
                    </option>

                    <option value="Tarapacá">
                      Tarapacá
                    </option>

                    <option value="Antofagasta">
                      Antofagasta
                    </option>

                    <option value="Atacama">
                      Atacama
                    </option>

                    <option value="Coquimbo">
                      Coquimbo
                    </option>

                    <option value="Valparaíso">
                      Valparaíso
                    </option>

                    <option value="Metropolitana de Santiago">
                      Metropolitana de Santiago
                    </option>

                    <option value="O'Higgins">
                      O'Higgins
                    </option>

                    <option value="Maule">
                      Maule
                    </option>

                    <option value="Ñuble">
                      Ñuble
                    </option>

                    <option value="Biobío">
                      Biobío
                    </option>

                    <option value="La Araucanía">
                      La Araucanía
                    </option>

                    <option value="Los Ríos">
                      Los Ríos
                    </option>

                    <option value="Los Lagos">
                      Los Lagos
                    </option>

                    <option value="Aysén">
                      Aysén
                    </option>

                    <option value="Magallanes">
                      Magallanes
                    </option>

                  </select>

                </div>

                {/* =============================================
                    DIRECCIÓN
                   ============================================= */}

                <div className="admin-form-group admin-form-full">

                  <label>
                    Dirección
                  </label>

                  <input
                    type="text"
                    value={
                      formulario.address
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'address',
                        e.target.value,
                      )
                    }
                    placeholder="Dirección comercial"
                  />

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
                    value={
                      formulario.notes
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'notes',
                        e.target.value,
                      )
                    }
                    placeholder="Información adicional del cliente..."
                  />

                </div>

              </div>

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
                    : 'Guardar cliente'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}