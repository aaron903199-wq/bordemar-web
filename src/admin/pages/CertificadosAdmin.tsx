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
  status: 'ACTIVE' | 'INACTIVE'
  vesselId: string
}

type EstadoCertificado =
  | 'DRAFT'
  | 'VALID'
  | 'EXPIRED'
  | 'REVOKED'
  | 'CANCELLED'

interface Certificado {
  id: string
  certificateNumber: string
  verificationCode: string
  certificateType: string
  title?: string
  issueDate: string
  expirationDate?: string
  status: EstadoCertificado
  observations?: string
  issuedBy?: string
  signedBy?: string
  vesselId: string
  equipmentId?: string
  vessel: Nave
  equipment?: Equipo
  pdfUrl?: string
  documentHash?: string
  technicalPdfOriginalUrl?: string
  technicalPdfUrl?: string
  technicalDocumentHash?: string
  signatureDate?: string
  statusReason?: string
  statusChangedAt?: string
  statusChangedBy?: string
}

interface FormCertificado {
  certificateType: string
  title: string
  issueDate: string
  expirationDate: string
  vesselId: string
  equipmentId: string
  observations: string
  issuedBy: string
  signedBy: string
}

const API_URL =
  import.meta.env.VITE_CERT_API_URL ||
  'http://localhost:3000'

const obtenerToken = () =>
  sessionStorage.getItem('bordemar_cert_token') ||
  localStorage.getItem('bordemar_cert_token') ||
  sessionStorage.getItem('accessToken') ||
  localStorage.getItem('accessToken')

const cerrarSesionPorExpiracion = () => {
  sessionStorage.removeItem('bordemar_cert_token')
  localStorage.removeItem('bordemar_cert_token')
  sessionStorage.removeItem('accessToken')
  localStorage.removeItem('accessToken')
  window.location.href = '/admin/login'
}

const fetchAutenticado = async (
  input: RequestInfo | URL,
  init: RequestInit = {},
) => {
  const token = obtenerToken()
  const headers = new Headers(init.headers)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(input, {
    ...init,
    headers,
  })

  if (response.status === 401) {
    cerrarSesionPorExpiracion()
    throw new Error(
      'La sesión expiró o no está autorizada. Inicia sesión nuevamente.',
    )
  }

  return response
}

const obtenerFechaHoy = () =>
  new Date().toISOString().split('T')[0]

const formularioInicial: FormCertificado = {
  certificateType: '',
  title: '',
  issueDate: obtenerFechaHoy(),
  expirationDate: '',
  vesselId: '',
  equipmentId: '',
  observations: '',
  issuedBy: 'Servicios Marítimos Bordemar SPA',
  signedBy: '',
}

export default function CertificadosAdmin() {
  const [certificados, setCertificados] =
    useState<Certificado[]>([])

  const [naves, setNaves] =
    useState<Nave[]>([])

  const [equipos, setEquipos] =
    useState<Equipo[]>([])

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false)

  const [
    certificadoSeleccionado,
    setCertificadoSeleccionado,
  ] = useState<Certificado | null>(null)

  const [cargando, setCargando] =
    useState(true)

  const [guardando, setGuardando] =
    useState(false)

  const [emitiendo, setEmitiendo] =
    useState(false)

  const [editando, setEditando] = useState(false)
  const [procesandoEstado, setProcesandoEstado] = useState(false)

  const [archivoTecnico, setArchivoTecnico] =
    useState<File | null>(null)

  const [subiendoPdfTecnico, setSubiendoPdfTecnico] =
    useState(false)

  const [busqueda, setBusqueda] =
    useState('')

  const [mensaje, setMensaje] =
    useState('')

  const [error, setError] =
    useState('')

  const [formulario, setFormulario] =
    useState<FormCertificado>(formularioInicial)

  // =========================================================
  // CARGAR CERTIFICADOS
  // =========================================================

  const cargarCertificados = async () => {
    try {
      setCargando(true)

      const response = await fetchAutenticado(
        `${API_URL}/certificates`,
      )

      if (!response.ok) {
        throw new Error(
          'No fue posible cargar los certificados.',
        )
      }

      const data = await response.json()

      setCertificados(data)
    } catch (err) {
      console.error(err)

      setError(
        'No fue posible conectar con el servidor de certificados.',
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
      const response = await fetchAutenticado(
        `${API_URL}/vessels`,
      )

      if (!response.ok) {
        throw new Error(
          'No fue posible cargar las naves.',
        )
      }

      const data = await response.json()

      setNaves(data)
    } catch (err) {
      console.error(err)

      setError(
        'No fue posible cargar las naves.',
      )
    }
  }

  // =========================================================
  // CARGAR EQUIPOS
  // =========================================================

  const cargarEquipos = async () => {
    try {
      const response = await fetchAutenticado(
        `${API_URL}/equipment`,
      )

      if (!response.ok) {
        throw new Error(
          'No fue posible cargar los equipos.',
        )
      }

      const data = await response.json()

      setEquipos(data)
    } catch (err) {
      console.error(err)

      setError(
        'No fue posible cargar los equipos.',
      )
    }
  }

  useEffect(() => {
    cargarCertificados()
    cargarNaves()
    cargarEquipos()
  }, [])

  // =========================================================
  // FORMULARIO
  // =========================================================

  const actualizarCampo = (
    campo: keyof FormCertificado,
    valor: string,
  ) => {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }))
  }

  const seleccionarNave = (
    vesselId: string,
  ) => {
    setFormulario((actual) => ({
      ...actual,
      vesselId,
      equipmentId: '',
    }))
  }

  const abrirFormulario = () => {
    setFormulario({
      ...formularioInicial,
      issueDate: obtenerFechaHoy(),
    })

    setError('')
    setMensaje('')
    setMostrarFormulario(true)
  }

  const cerrarFormulario = () => {
    if (guardando) return

    setMostrarFormulario(false)
    setFormulario(formularioInicial)
    setError('')
  }

  // =========================================================
  // CREAR CERTIFICADO
  // =========================================================

  const guardarCertificado = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()

    setError('')
    setMensaje('')

    if (
      !formulario.certificateType.trim() ||
      !formulario.issueDate ||
      !formulario.vesselId
    ) {
      setError(
        'Tipo de certificado, fecha de emisión y nave son obligatorios.',
      )

      return
    }

    if (
      formulario.expirationDate &&
      formulario.expirationDate <
        formulario.issueDate
    ) {
      setError(
        'La fecha de vencimiento no puede ser anterior a la fecha de emisión.',
      )

      return
    }

    try {
      setGuardando(true)

      const response = await fetchAutenticado(
        `${API_URL}/certificates`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            certificateType:
              formulario.certificateType.trim(),

            title:
              formulario.title.trim() ||
              undefined,

            issueDate:
              formulario.issueDate,

            expirationDate:
              formulario.expirationDate ||
              undefined,

            vesselId:
              formulario.vesselId,

            equipmentId:
              formulario.equipmentId ||
              undefined,

            observations:
              formulario.observations.trim() ||
              undefined,

            issuedBy:
              formulario.issuedBy.trim() ||
              'Servicios Marítimos Bordemar SPA',

            signedBy:
              formulario.signedBy.trim() ||
              undefined,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        const mensajeServidor =
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message

        throw new Error(
          mensajeServidor ||
            'No fue posible registrar el certificado.',
        )
      }

      setMostrarFormulario(false)

      setFormulario({
        ...formularioInicial,
        issueDate: obtenerFechaHoy(),
      })

      setMensaje(
        `Certificado ${data.certificateNumber} creado correctamente.`,
      )

      await cargarCertificados()
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible registrar el certificado.',
      )
    } finally {
      setGuardando(false)
    }
  }

  // =========================================================
  // EMITIR CERTIFICADO
  // PATCH /certificates/:id/issue
  // =========================================================

  const emitirCertificado = async () => {
    if (!certificadoSeleccionado) return

    if (certificadoSeleccionado.status !== 'DRAFT') {
      setError(
        'Este certificado ya fue emitido o no se encuentra en estado BORRADOR.',
      )
      return
    }

    let certificadoParaEmitir = certificadoSeleccionado

    // Si el certificado todavía no tiene responsable/firmante,
    // lo solicitamos antes de emitirlo.
    if (!certificadoParaEmitir.signedBy?.trim()) {
      const firmante = window.prompt(
        'Antes de emitir el certificado debes indicar el Responsable / Firmante:',
      )

      if (!firmante?.trim()) {
        setError(
          'Debes indicar el Responsable / Firmante antes de emitir el certificado.',
        )
        return
      }

      try {
        setEmitiendo(true)
        setError('')
        setMensaje('')

        const responseFirmante = await fetchAutenticado(
          `${API_URL}/certificates/${certificadoParaEmitir.id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              signedBy: firmante.trim(),
            }),
          },
        )

        const dataFirmante = await responseFirmante.json()

        if (!responseFirmante.ok) {
          const mensajeServidor = Array.isArray(dataFirmante.message)
            ? dataFirmante.message.join(', ')
            : dataFirmante.message

          throw new Error(
            mensajeServidor ||
              'No fue posible registrar el responsable del certificado.',
          )
        }

        certificadoParaEmitir = dataFirmante
        setCertificadoSeleccionado(dataFirmante)

        setCertificados((actuales) =>
          actuales.map((certificado) =>
            certificado.id === dataFirmante.id
              ? dataFirmante
              : certificado,
          ),
        )
      } catch (err) {
        console.error(err)

        setError(
          err instanceof Error
            ? err.message
            : 'No fue posible registrar el responsable del certificado.',
        )
        setEmitiendo(false)
        return
      }
    }

    const confirmado = window.confirm(
      `¿Deseas emitir definitivamente el certificado ${certificadoParaEmitir.certificateNumber}?\n\nUna vez emitido quedará en estado VIGENTE y ya no podrá modificarse como borrador.`,
    )

    if (!confirmado) {
      setEmitiendo(false)
      return
    }

    try {
      setEmitiendo(true)
      setError('')
      setMensaje('')

      const response = await fetchAutenticado(
        `${API_URL}/certificates/${certificadoParaEmitir.id}/issue`,
        {
          method: 'PATCH',
        },
      )

      let data: any = null

      try {
        data = await response.json()
      } catch {
        data = null
      }

      if (!response.ok) {
        const mensajeServidor = Array.isArray(data?.message)
          ? data.message.join(', ')
          : data?.message

        throw new Error(
          mensajeServidor ||
            `No fue posible emitir el certificado. Error HTTP ${response.status}.`,
        )
      }

      setCertificadoSeleccionado(data)

      setCertificados((actuales) =>
        actuales.map((certificado) =>
          certificado.id === data.id
            ? data
            : certificado,
        ),
      )

      setMensaje(
        `Certificado ${data.certificateNumber} emitido correctamente.`,
      )

      await cargarCertificados()
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible emitir el certificado.',
      )
    } finally {
      setEmitiendo(false)
    }
  }

  // =========================================================
  // EDITAR BORRADOR
  // =========================================================
  const editarCertificado = async () => {
    if (!certificadoSeleccionado || certificadoSeleccionado.status !== 'DRAFT') return
    const certificateType = window.prompt('Tipo de certificado:', certificadoSeleccionado.certificateType)
    if (certificateType === null) return
    const title = window.prompt('Título:', certificadoSeleccionado.title || '')
    if (title === null) return
    const observations = window.prompt('Observaciones:', certificadoSeleccionado.observations || '')
    if (observations === null) return
    const signedBy = window.prompt('Responsable / Firmante:', certificadoSeleccionado.signedBy || '')
    if (signedBy === null) return

    try {
      setEditando(true); setError(''); setMensaje('')
      const response = await fetchAutenticado(`${API_URL}/certificates/${certificadoSeleccionado.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificateType: certificateType.trim(),
          title: title.trim() || undefined,
          observations: observations.trim() || undefined,
          signedBy: signedBy.trim() || undefined,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(Array.isArray(data.message) ? data.message.join(', ') : data.message || 'No fue posible actualizar el certificado.')
      setCertificadoSeleccionado(data)
      setCertificados(a => a.map(c => c.id === data.id ? data : c))
      setMensaje(`Certificado ${data.certificateNumber} actualizado correctamente.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible actualizar el certificado.')
    } finally { setEditando(false) }
  }

  // =========================================================
  // ANULAR: DRAFT -> CANCELLED
  // =========================================================
  const anularCertificado = async () => {
    if (!certificadoSeleccionado || certificadoSeleccionado.status !== 'DRAFT') return
    const reason = window.prompt(`Motivo de anulación de ${certificadoSeleccionado.certificateNumber}:`)
    if (!reason?.trim()) return
    if (!window.confirm(`¿Confirmas la ANULACIÓN de ${certificadoSeleccionado.certificateNumber}?`)) return

    try {
      setProcesandoEstado(true); setError(''); setMensaje('')
      const response = await fetchAutenticado(`${API_URL}/certificates/${certificadoSeleccionado.id}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason.trim() }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(Array.isArray(data.message) ? data.message.join(', ') : data.message || 'No fue posible anular el certificado.')
      setCertificadoSeleccionado(data)
      setCertificados(a => a.map(c => c.id === data.id ? data : c))
      setMensaje(`Certificado ${data.certificateNumber} anulado correctamente.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible anular el certificado.')
    } finally { setProcesandoEstado(false) }
  }

  // =========================================================
  // REVOCAR: VALID -> REVOKED
  // =========================================================
  const revocarCertificado = async () => {
    if (!certificadoSeleccionado || certificadoSeleccionado.status !== 'VALID') return
    const reason = window.prompt(`Motivo de revocación de ${certificadoSeleccionado.certificateNumber}:`)
    if (!reason?.trim()) return
    if (!window.confirm(`¿Confirmas la REVOCACIÓN de ${certificadoSeleccionado.certificateNumber}? El PDF histórico y SHA-256 se conservarán.`)) return

    try {
      setProcesandoEstado(true); setError(''); setMensaje('')
      const response = await fetchAutenticado(`${API_URL}/certificates/${certificadoSeleccionado.id}/revoke`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason.trim() }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(Array.isArray(data.message) ? data.message.join(', ') : data.message || 'No fue posible revocar el certificado.')
      setCertificadoSeleccionado(data)
      setCertificados(a => a.map(c => c.id === data.id ? data : c))
      setMensaje(`Certificado ${data.certificateNumber} revocado correctamente.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible revocar el certificado.')
    } finally { setProcesandoEstado(false) }
  }

  // =========================================================
  // PDF TÉCNICO
  // =========================================================

  const subirPdfTecnico = async () => {
    if (!certificadoSeleccionado) return

    if (certificadoSeleccionado.status !== 'DRAFT') {
      setError(
        'El PDF técnico solo puede cargarse mientras el certificado se encuentre en BORRADOR.',
      )
      return
    }

    if (!archivoTecnico) {
      setError('Selecciona un archivo PDF técnico.')
      return
    }

    if (
      archivoTecnico.type !== 'application/pdf' &&
      !archivoTecnico.name.toLowerCase().endsWith('.pdf')
    ) {
      setError('Solo se permite cargar un archivo PDF.')
      return
    }

    try {
      setSubiendoPdfTecnico(true)
      setError('')
      setMensaje('')

      const formData = new FormData()
      formData.append('file', archivoTecnico)

      const response = await fetchAutenticado(
        `${API_URL}/certificates/${certificadoSeleccionado.id}/technical-pdf`,
        {
          method: 'POST',
          body: formData,
        },
      )

      let data: any = null

      try {
        data = await response.json()
      } catch {
        data = null
      }

      if (!response.ok) {
        const mensajeServidor = Array.isArray(data?.message)
          ? data.message.join(', ')
          : data?.message

        throw new Error(
          mensajeServidor ||
            `No fue posible cargar el PDF técnico. Error HTTP ${response.status}.`,
        )
      }

      setCertificadoSeleccionado(data)

      setCertificados((actuales) =>
        actuales.map((certificado) =>
          certificado.id === data.id
            ? data
            : certificado,
        ),
      )

      setArchivoTecnico(null)

      setMensaje(
        data.technicalPdfOriginalUrl
          ? `PDF técnico asociado correctamente a ${data.certificateNumber}.`
          : 'PDF técnico cargado correctamente.',
      )

      await cargarCertificados()
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible cargar el PDF técnico.',
      )
    } finally {
      setSubiendoPdfTecnico(false)
    }
  }

  const abrirPdfTecnico = () => {
    if (!certificadoSeleccionado?.technicalPdfUrl) {
      setError(
        'Este certificado no posee un PDF técnico autenticado disponible.',
      )
      return
    }

    window.open(
      `${API_URL}${certificadoSeleccionado.technicalPdfUrl}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  const abrirPdf = () => {
    if (!certificadoSeleccionado?.pdfUrl) {
      setError('Este certificado no posee un PDF definitivo disponible.')
      return
    }
    window.open(`${API_URL}${certificadoSeleccionado.pdfUrl}`, '_blank', 'noopener,noreferrer')
  }

  const abrirVerificacionPublica = () => {
    if (!certificadoSeleccionado) return
    window.open(`/verificar-certificado?codigo=${encodeURIComponent(certificadoSeleccionado.verificationCode)}`, '_blank', 'noopener,noreferrer')
  }

  // =========================================================
  // EQUIPOS DE LA NAVE SELECCIONADA
  // =========================================================

  const equiposDeNave = equipos.filter(
    (equipo) =>
      equipo.vesselId ===
        formulario.vesselId &&
      equipo.status === 'ACTIVE',
  )

  // =========================================================
  // ESTADOS
  // =========================================================

  const obtenerEstado = (
    status: EstadoCertificado,
  ) => {
    switch (status) {
      case 'DRAFT':
        return 'BORRADOR'

      case 'VALID':
        return 'VIGENTE'

      case 'EXPIRED':
        return 'VENCIDO'

      case 'REVOKED':
        return 'REVOCADO'

      case 'CANCELLED':
        return 'ANULADO'

      default:
        return status
    }
  }

  // =========================================================
  // FECHAS
  // =========================================================

  const formatearFecha = (
    fecha?: string,
  ) => {
    if (!fecha) return '—'

    const date = new Date(fecha)

    return date.toLocaleDateString(
      'es-CL',
      {
        timeZone: 'UTC',
      },
    )
  }

  // =========================================================
  // FILTRO
  // =========================================================

  const certificadosFiltrados =
    certificados.filter(
      (certificado) => {
        const texto =
          busqueda
            .toLowerCase()
            .trim()

        return (
          certificado.certificateNumber
            .toLowerCase()
            .includes(texto) ||

          certificado.verificationCode
            .toLowerCase()
            .includes(texto) ||

          certificado.certificateType
            .toLowerCase()
            .includes(texto) ||

          certificado.vessel?.name
            ?.toLowerCase()
            .includes(texto) ||

          certificado.vessel?.registration
            ?.toLowerCase()
            .includes(texto) ||

          certificado.equipment?.name
            ?.toLowerCase()
            .includes(texto)
        )
      },
    )

  return (
    <div className="admin-certificados">

      {/* =====================================================
          ENCABEZADO
      ===================================================== */}

      <div className="admin-page-header">

        <div>
          <span className="admin-eyebrow">
            CERTIFICACIÓN
          </span>

          <h1>Certificados</h1>

          <p>
            Emisión, vigencia y trazabilidad de
            certificados Bordemar.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={abrirFormulario}
        >
          + Nuevo certificado
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

      {error &&
        !mostrarFormulario && (
          <div className="admin-error-message">
            {error}
          </div>
        )}

      {/* =====================================================
          TABLA
      ===================================================== */}

      <section className="admin-panel admin-clientes-panel">

        <div className="admin-clientes-toolbar">

          <div className="admin-search-box">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Buscar por certificado, código, nave o equipo..."
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
              Total certificados
            </span>

            <strong>
              {certificados.length}
            </strong>
          </div>

        </div>

        <div className="admin-table-wrapper">

          <table className="admin-table">

            <thead>
              <tr>
                <th>N° Certificado</th>
                <th>Tipo</th>
                <th>Nave</th>
                <th>Equipo</th>
                <th>Emisión</th>
                <th>Vencimiento</th>
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
                        Cargando certificados...
                      </p>
                    </div>
                  </td>
                </tr>

              ) : certificadosFiltrados.length ===
                0 ? (

                <tr>
                  <td colSpan={8}>

                    <div className="admin-table-empty">

                      <div className="admin-empty-icon">
                        ▤
                      </div>

                      <h3>
                        No existen certificados
                      </h3>

                      <p>
                        Crea el primer certificado
                        BORDEMAR CERT.
                      </p>

                      <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={abrirFormulario}
                      >
                        + Crear certificado
                      </button>

                    </div>

                  </td>
                </tr>

              ) : (

                certificadosFiltrados.map(
                  (certificado) => (

                    <tr
                      key={
                        certificado.id
                      }
                    >

                      <td>
                        <strong>
                          {
                            certificado
                              .certificateNumber
                          }
                        </strong>

                        <div
                          style={{
                            fontSize:
                              '11px',
                            opacity: 0.65,
                            marginTop:
                              '4px',
                          }}
                        >
                          {
                            certificado
                              .verificationCode
                          }
                        </div>
                      </td>

                      <td>
                        {
                          certificado
                            .certificateType
                        }
                      </td>

                      <td>
                        <strong>
                          {
                            certificado
                              .vessel
                              ?.name || '—'
                          }
                        </strong>

                        <div
                          style={{
                            fontSize:
                              '11px',
                            opacity: 0.65,
                            marginTop:
                              '4px',
                          }}
                        >
                          {
                            certificado
                              .vessel
                              ?.registration ||
                            '—'
                          }
                        </div>
                      </td>

                      <td>
                        {
                          certificado
                            .equipment
                            ?.name || '—'
                        }
                      </td>

                      <td>
                        {formatearFecha(
                          certificado
                            .issueDate,
                        )}
                      </td>

                      <td>
                        {formatearFecha(
                          certificado
                            .expirationDate,
                        )}
                      </td>

                      <td>
                        {obtenerEstado(
                          certificado.status,
                        )}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="admin-table-action"
                          onClick={() =>
                            setCertificadoSeleccionado(
                              certificado,
                            )
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
          MODAL NUEVO CERTIFICADO
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
                  Nuevo certificado
                </h2>

                <p>
                  Registra un certificado
                  asociado a una nave y,
                  cuando corresponda, a un
                  equipo.
                </p>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={
                  cerrarFormulario
                }
                disabled={guardando}
              >
                ×
              </button>

            </div>

            <form
              onSubmit={
                guardarCertificado
              }
            >

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
                      seleccionarNave(
                        e.target.value,
                      )
                    }
                    required
                  >

                    <option value="">
                      Seleccionar nave
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
                            key={
                              nave.id
                            }
                            value={
                              nave.id
                            }
                          >
                            {nave.name}
                            {' — '}
                            {
                              nave.registration
                            }
                          </option>

                        ),
                      )}

                  </select>

                </div>

                {/* EQUIPO */}

                <div className="admin-form-group admin-form-full">

                  <label>
                    Equipo
                  </label>

                  <select
                    value={
                      formulario
                        .equipmentId
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'equipmentId',
                        e.target.value,
                      )
                    }
                    disabled={
                      !formulario.vesselId
                    }
                  >

                    <option value="">
                      Sin equipo específico
                    </option>

                    {equiposDeNave.map(
                      (equipo) => (

                        <option
                          key={
                            equipo.id
                          }
                          value={
                            equipo.id
                          }
                        >
                          {equipo.name}

                          {equipo.brand
                            ? ` — ${equipo.brand}`
                            : ''}

                          {equipo.model
                            ? ` ${equipo.model}`
                            : ''}
                        </option>

                      ),
                    )}

                  </select>

                </div>

                {/* TIPO */}

                <div className="admin-form-group">

                  <label>
                    Tipo de certificado
                    <span>*</span>
                  </label>

                  <select
                    value={
                      formulario
                        .certificateType
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'certificateType',
                        e.target.value,
                      )
                    }
                    required
                  >

                    <option value="">
                      Seleccionar tipo
                    </option>

                    <option value="Certificación de Grúa">
                      Certificación de Grúa
                    </option>

                    <option value="Certificación de Virador">
                      Certificación de Virador
                    </option>

                    <option value="Certificación de Cabrestante">
                      Certificación de Cabrestante
                    </option>

                    <option value="Certificación de Generador">
                      Certificación de Generador
                    </option>

                    <option value="Certificación de Compás">
                      Certificación de Compás
                    </option>

                    <option value="Tabla de Desvío">
                      Tabla de Desvío
                    </option>

                    <option value="Certificación de Barómetro">
                      Certificación de Barómetro
                    </option>

                    <option value="Certificación ROE">
                      Certificación ROE
                    </option>

                    <option value="Otro">
                      Otro
                    </option>

                  </select>

                </div>

                {/* TITULO */}

                <div className="admin-form-group">

                  <label>
                    Título
                  </label>

                  <input
                    type="text"
                    placeholder="Ej: Certificado de Inspección"
                    value={
                      formulario.title
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'title',
                        e.target.value,
                      )
                    }
                  />

                </div>

                {/* FECHA EMISION */}

                <div className="admin-form-group">

                  <label>
                    Fecha de emisión
                    <span>*</span>
                  </label>

                  <input
                    type="date"
                    value={
                      formulario
                        .issueDate
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'issueDate',
                        e.target.value,
                      )
                    }
                    required
                  />

                </div>

                {/* FECHA VENCIMIENTO */}

                <div className="admin-form-group">

                  <label>
                    Fecha de vencimiento
                  </label>

                  <input
                    type="date"
                    min={
                      formulario
                        .issueDate
                    }
                    value={
                      formulario
                        .expirationDate
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'expirationDate',
                        e.target.value,
                      )
                    }
                  />

                </div>

                {/* EMITIDO POR */}

                <div className="admin-form-group admin-form-full">

                  <label>
                    Emitido por
                  </label>

                  <input
                    type="text"
                    value={
                      formulario
                        .issuedBy
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'issuedBy',
                        e.target.value,
                      )
                    }
                  />

                </div>

                {/* FIRMANTE */}

                <div className="admin-form-group admin-form-full">

                  <label>
                    Responsable / Firmante
                  </label>

                  <input
                    type="text"
                    placeholder="Nombre del responsable"
                    value={
                      formulario
                        .signedBy
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'signedBy',
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
                    rows={4}
                    placeholder="Observaciones del certificado..."
                    value={
                      formulario
                        .observations
                    }
                    onChange={(e) =>
                      actualizarCampo(
                        'observations',
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
                  disabled={
                    guardando
                  }
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={
                    guardando
                  }
                >
                  {guardando
                    ? 'Creando...'
                    : 'Crear certificado'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =====================================================
          FICHA / DETALLE DEL CERTIFICADO
      ===================================================== */}

      {certificadoSeleccionado && (

        <div
          className="admin-modal-overlay"
          onMouseDown={() =>
            setCertificadoSeleccionado(
              null,
            )
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
                  {
                    certificadoSeleccionado
                      .certificateNumber
                  }
                </h2>

                <p>
                  Ficha y trazabilidad del
                  certificado.
                </p>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={() =>
                  setCertificadoSeleccionado(
                    null,
                  )
                }
              >
                ×
              </button>

            </div>

            <div className="admin-form-grid">

              {/* NUMERO */}

              <div className="admin-form-group">

                <label>
                  N.º certificado
                </label>

                <input
                  value={
                    certificadoSeleccionado
                      .certificateNumber
                  }
                  readOnly
                />

              </div>

              {/* CODIGO */}

              <div className="admin-form-group">

                <label>
                  Código de verificación
                </label>

                <input
                  value={
                    certificadoSeleccionado
                      .verificationCode
                  }
                  readOnly
                />

              </div>

              {/* ESTADO */}

              <div className="admin-form-group">

                <label>
                  Estado
                </label>

                <input
                  value={obtenerEstado(
                    certificadoSeleccionado
                      .status,
                  )}
                  readOnly
                />

              </div>

              {/* TIPO */}

              <div className="admin-form-group">

                <label>
                  Tipo de certificado
                </label>

                <input
                  value={
                    certificadoSeleccionado
                      .certificateType
                  }
                  readOnly
                />

              </div>

              {/* TITULO */}

              <div className="admin-form-group admin-form-full">

                <label>
                  Título
                </label>

                <input
                  value={
                    certificadoSeleccionado
                      .title || '—'
                  }
                  readOnly
                />

              </div>

              {/* CLIENTE */}

              <div className="admin-form-group admin-form-full">

                <label>
                  Cliente / Armador
                </label>

                <input
                  value={
                    certificadoSeleccionado
                      .vessel
                      ?.client
                      ?.businessName ||
                    '—'
                  }
                  readOnly
                />

              </div>

              {/* RUT */}

              <div className="admin-form-group admin-form-full">

                <label>
                  RUT Cliente / Armador
                </label>

                <input
                  value={
                    certificadoSeleccionado
                      .vessel
                      ?.client
                      ?.rut ||
                    '—'
                  }
                  readOnly
                />

              </div>

              {/* NAVE */}

              <div className="admin-form-group">

                <label>
                  Nave
                </label>

                <input
                  value={
                    certificadoSeleccionado
                      .vessel
                      ?.name ||
                    '—'
                  }
                  readOnly
                />

              </div>

              {/* MATRICULA */}

              <div className="admin-form-group">

                <label>
                  Matrícula
                </label>

                <input
                  value={
                    certificadoSeleccionado
                      .vessel
                      ?.registration ||
                    '—'
                  }
                  readOnly
                />

              </div>

              {/* CALL SIGN */}

              <div className="admin-form-group">

                <label>
                  Señal de llamada
                </label>

                <input
                  value={
                    certificadoSeleccionado
                      .vessel
                      ?.callSign ||
                    '—'
                  }
                  readOnly
                />

              </div>

              {/* TIPO NAVE */}

              <div className="admin-form-group">

                <label>
                  Tipo de nave
                </label>

                <input
                  value={
                    certificadoSeleccionado
                      .vessel
                      ?.vesselType ||
                    '—'
                  }
                  readOnly
                />

              </div>

              {/* EQUIPO */}

              <div className="admin-form-group admin-form-full">

                <label>
                  Equipo
                </label>

                <input
                  value={
                    certificadoSeleccionado
                      .equipment
                      ?.name ||
                    'Sin equipo específico'
                  }
                  readOnly
                />

              </div>

              {/* CATEGORIA */}

              <div className="admin-form-group">

                <label>
                  Categoría
                </label>

                <input
                  value={
                    certificadoSeleccionado
                      .equipment
                      ?.category ||
                    '—'
                  }
                  readOnly
                />

              </div>

              {/* MARCA */}

              <div className="admin-form-group">

                <label>
                  Marca
                </label>

                <input
                  value={
                    certificadoSeleccionado
                      .equipment
                      ?.brand ||
                    '—'
                  }
                  readOnly
                />

              </div>

              {/* MODELO */}

              <div className="admin-form-group">

                <label>
                  Modelo
                </label>

                <input
                  value={
                    certificadoSeleccionado
                      .equipment
                      ?.model ||
                    '—'
                  }
                  readOnly
                />

              </div>

              {/* SERIE */}

              <div className="admin-form-group">

                <label>
                  N.º de serie
                </label>

                <input
                  value={
                    certificadoSeleccionado
                      .equipment
                      ?.serialNumber ||
                    '—'
                  }
                  readOnly
                />

              </div>

              {/* UBICACION */}

              <div className="admin-form-group admin-form-full">

                <label>
                  Ubicación del equipo
                </label>

                <input
                  value={
                    certificadoSeleccionado
                      .equipment
                      ?.location ||
                    '—'
                  }
                  readOnly
                />

              </div>

              {/* EMISION */}

              <div className="admin-form-group">

                <label>
                  Fecha de emisión
                </label>

                <input
                  value={formatearFecha(
                    certificadoSeleccionado
                      .issueDate,
                  )}
                  readOnly
                />

              </div>

              {/* VENCIMIENTO */}

              <div className="admin-form-group">

                <label>
                  Fecha de vencimiento
                </label>

                <input
                  value={formatearFecha(
                    certificadoSeleccionado
                      .expirationDate,
                  )}
                  readOnly
                />

              </div>

              {/* EMITIDO POR */}

              <div className="admin-form-group admin-form-full">

                <label>
                  Emitido por
                </label>

                <input
                  value={
                    certificadoSeleccionado
                      .issuedBy ||
                    'Servicios Marítimos Bordemar SPA'
                  }
                  readOnly
                />

              </div>

              {/* FIRMANTE */}

              <div className="admin-form-group admin-form-full">

                <label>
                  Responsable / Firmante
                </label>

                <input
                  value={
                    certificadoSeleccionado
                      .signedBy ||
                    'Pendiente'
                  }
                  readOnly
                />

              </div>

              {(certificadoSeleccionado.status === 'REVOKED' ||
                certificadoSeleccionado.status === 'CANCELLED') && (
                <>
                  <div className="admin-form-group admin-form-full">
                    <label>Motivo de {certificadoSeleccionado.status === 'REVOKED' ? 'revocación' : 'anulación'}</label>
                    <textarea rows={3} value={certificadoSeleccionado.statusReason || 'Sin motivo registrado.'} readOnly />
                  </div>
                  <div className="admin-form-group">
                    <label>Fecha del cambio de estado</label>
                    <input value={formatearFecha(certificadoSeleccionado.statusChangedAt)} readOnly />
                  </div>
                  <div className="admin-form-group">
                    <label>Responsable del cambio</label>
                    <input value={certificadoSeleccionado.statusChangedBy || '—'} readOnly />
                  </div>
                </>
              )}

              {/* PDF TÉCNICO */}

              <div className="admin-form-group admin-form-full">

                <label>
                  Documento técnico
                </label>

                {certificadoSeleccionado.status === 'DRAFT' ? (
                  <>
                    <div
                      style={{
                        padding: '14px',
                        border: '1px solid rgba(15, 39, 71, 0.18)',
                        borderRadius: '10px',
                        background: 'rgba(15, 39, 71, 0.035)',
                      }}
                    >
                      <div
                        style={{
                          marginBottom: '10px',
                          fontSize: '13px',
                          lineHeight: 1.5,
                        }}
                      >
                        {certificadoSeleccionado.technicalPdfOriginalUrl
                          ? 'PDF técnico cargado. Puedes reemplazarlo mientras el certificado siga en BORRADOR.'
                          : 'Opcional: carga el certificado técnico original en PDF. Al emitir, BORDEMAR CERT generará automáticamente una copia autenticada con QR, código BMC y número SMB.'}
                      </div>

                      <input
                        type="file"
                        accept="application/pdf,.pdf"
                        disabled={subiendoPdfTecnico || emitiendo}
                        onChange={(e) =>
                          setArchivoTecnico(
                            e.target.files?.[0] || null,
                          )
                        }
                      />

                      {archivoTecnico && (
                        <div
                          style={{
                            marginTop: '8px',
                            fontSize: '12px',
                            opacity: 0.75,
                          }}
                        >
                          Seleccionado: {archivoTecnico.name}
                        </div>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          flexWrap: 'wrap',
                          marginTop: '12px',
                        }}
                      >
                        <button
                          type="button"
                          className="admin-secondary-button"
                          onClick={subirPdfTecnico}
                          disabled={
                            !archivoTecnico ||
                            subiendoPdfTecnico ||
                            emitiendo
                          }
                        >
                          {subiendoPdfTecnico
                            ? 'Cargando PDF...'
                            : certificadoSeleccionado.technicalPdfOriginalUrl
                              ? 'Reemplazar PDF técnico'
                              : 'Cargar PDF técnico'}
                        </button>
                      </div>
                    </div>
                  </>
                ) : certificadoSeleccionado.technicalPdfUrl ? (
                  <div
                    style={{
                      padding: '14px',
                      border: '1px solid rgba(15, 39, 71, 0.18)',
                      borderRadius: '10px',
                      background: 'rgba(15, 39, 71, 0.035)',
                    }}
                  >
                    <strong>PDF técnico autenticado disponible</strong>

                    <div
                      style={{
                        marginTop: '5px',
                        fontSize: '12px',
                        opacity: 0.75,
                      }}
                    >
                      Documento autenticado por BORDEMAR CERT con QR y trazabilidad.
                    </div>

                    {certificadoSeleccionado.technicalDocumentHash && (
                      <div
                        style={{
                          marginTop: '8px',
                          fontSize: '11px',
                          wordBreak: 'break-all',
                          opacity: 0.65,
                        }}
                      >
                        SHA-256: {certificadoSeleccionado.technicalDocumentHash}
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    value="Sin PDF técnico asociado"
                    readOnly
                  />
                )}

              </div>

              {/* OBSERVACIONES */}

              <div className="admin-form-group admin-form-full">

                <label>
                  Observaciones
                </label>

                <textarea
                  rows={4}
                  value={
                    certificadoSeleccionado
                      .observations ||
                    'Sin observaciones.'
                  }
                  readOnly
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
                onClick={() =>
                  setCertificadoSeleccionado(
                    null,
                  )
                }
              >
                Cerrar
              </button>

              {certificadoSeleccionado.status === 'DRAFT' && (
                <>
                  <button type="button" className="admin-secondary-button" onClick={editarCertificado} disabled={editando || emitiendo || procesandoEstado}>
                    {editando ? 'Guardando...' : 'Editar'}
                  </button>
                  <button type="button" className="admin-cancel-button" onClick={anularCertificado} disabled={editando || emitiendo || procesandoEstado}>
                    {procesandoEstado ? 'Procesando...' : 'Anular'}
                  </button>
                  <button type="button" className="admin-primary-button" onClick={emitirCertificado} disabled={editando || emitiendo || procesandoEstado}>
                    {emitiendo ? 'Emitiendo...' : 'Emitir certificado'}
                  </button>
                </>
              )}

              {(certificadoSeleccionado.status === 'VALID' ||
                certificadoSeleccionado.status === 'REVOKED' ||
                certificadoSeleccionado.status === 'EXPIRED') && (
                <>
                  {certificadoSeleccionado.pdfUrl && (
                    <button type="button" className="admin-secondary-button" onClick={abrirPdf}>
                      Ver PDF BORDEMAR CERT
                    </button>
                  )}
                  {certificadoSeleccionado.technicalPdfUrl && (
                    <button type="button" className="admin-secondary-button" onClick={abrirPdfTecnico}>
                      Ver PDF técnico
                    </button>
                  )}
                  <button type="button" className="admin-secondary-button" onClick={abrirVerificacionPublica}>
                    Verificar
                  </button>
                </>
              )}

              {certificadoSeleccionado.status === 'VALID' && (
                <button type="button" className="admin-cancel-button" onClick={revocarCertificado} disabled={procesandoEstado}>
                  {procesandoEstado ? 'Procesando...' : 'Revocar'}
                </button>
              )}

            </div>

          </div>

        </div>

      )}

    </div>
  )
}