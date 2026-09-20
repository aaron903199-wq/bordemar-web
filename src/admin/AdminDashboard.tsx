import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL =
  import.meta.env.VITE_CERT_API_URL ||
  'http://localhost:3000'

// =========================================================
// TIPOS
// =========================================================

type CertificateStatus =
  | 'DRAFT'
  | 'VALID'
  | 'EXPIRED'
  | 'REVOKED'
  | 'CANCELLED'

type Certificate = {
  id: string
  certificateNumber: string
  certificateType?: string | null
  title?: string | null
  issueDate?: string | null
  expirationDate?: string | null
  status: CertificateStatus

  vessel?: {
    id: string
    name: string
    registration?: string | null
  } | null

  equipment?: {
    id: string
    name: string
  } | null
}

type DashboardData = {
  clients: unknown[]
  vessels: unknown[]
  equipment: unknown[]
  certificates: Certificate[]
}

// =========================================================
// DASHBOARD
// =========================================================

export default function AdminDashboard() {
  const navigate = useNavigate()

  const [data, setData] = useState<DashboardData>({
    clients: [],
    vessels: [],
    equipment: [],
    certificates: [],
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // =========================================================
  // CARGAR INFORMACIÓN DESDE LA API
  // =========================================================

  useEffect(() => {
    const loadDashboard = async () => {
      const token = localStorage.getItem(
        'bordemar_cert_token',
      )

      if (!token) {
        navigate('/admin/login', {
          replace: true,
        })
        return
      }

      try {
        setLoading(true)
        setError('')

        const headers = {
          Authorization: `Bearer ${token}`,
        }

        const [
          clientsResponse,
          vesselsResponse,
          equipmentResponse,
          certificatesResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/clients`, {
            headers,
          }),

          fetch(`${API_URL}/vessels`, {
            headers,
          }),

          fetch(`${API_URL}/equipment`, {
            headers,
          }),

          fetch(`${API_URL}/certificates`, {
            headers,
          }),
        ])

        // =====================================================
        // TOKEN INVÁLIDO O VENCIDO
        // =====================================================

        const responses = [
          clientsResponse,
          vesselsResponse,
          equipmentResponse,
          certificatesResponse,
        ]

        const unauthorized = responses.some(
          (response) => response.status === 401,
        )

        if (unauthorized) {
          localStorage.removeItem(
            'bordemar_cert_token',
          )

          navigate('/admin/login', {
            replace: true,
          })

          return
        }

        // =====================================================
        // OTRO ERROR DE API
        // =====================================================

        const failed = responses.some(
          (response) => !response.ok,
        )

        if (failed) {
          throw new Error(
            'No fue posible cargar la información del Dashboard.',
          )
        }

        // =====================================================
        // LEER RESPUESTAS
        // =====================================================

        const [
          clients,
          vessels,
          equipment,
          certificates,
        ] = await Promise.all([
          clientsResponse.json(),
          vesselsResponse.json(),
          equipmentResponse.json(),
          certificatesResponse.json(),
        ])

        setData({
          clients: Array.isArray(clients)
            ? clients
            : [],

          vessels: Array.isArray(vessels)
            ? vessels
            : [],

          equipment: Array.isArray(equipment)
            ? equipment
            : [],

          certificates: Array.isArray(certificates)
            ? certificates
            : [],
        })
      } catch (error) {
        console.error(
          'Error cargando Dashboard:',
          error,
        )

        setError(
          'No fue posible cargar los datos de BORDEMAR CERT.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [navigate])

  // =========================================================
  // ESTADÍSTICAS DE CERTIFICADOS
  // =========================================================

  const statistics = useMemo(() => {
    const now = new Date()

    const next30Days = new Date()

    next30Days.setDate(
      next30Days.getDate() + 30,
    )

    let valid = 0
    let expiringSoon = 0
    let expired = 0

    data.certificates.forEach(
      (certificate) => {
        const expirationDate =
          certificate.expirationDate
            ? new Date(
                certificate.expirationDate,
              )
            : null

        // =====================================================
        // VENCIDOS
        // =====================================================

        if (
          certificate.status === 'EXPIRED' ||
          (
            expirationDate &&
            expirationDate < now
          )
        ) {
          expired += 1
          return
        }

        // =====================================================
        // VIGENTES
        // =====================================================

        if (
          certificate.status === 'VALID'
        ) {
          valid += 1

          // ===================================================
          // POR VENCER EN LOS PRÓXIMOS 30 DÍAS
          // ===================================================

          if (
            expirationDate &&
            expirationDate >= now &&
            expirationDate <= next30Days
          ) {
            expiringSoon += 1
          }
        }
      },
    )

    return {
      total: data.certificates.length,
      valid,
      expiringSoon,
      expired,
    }
  }, [data.certificates])

  // =========================================================
  // CERTIFICADOS RECIENTES
  // =========================================================

  const recentCertificates = useMemo(() => {
    return [...data.certificates]
      .sort((a, b) => {
        const dateA = new Date(
          a.issueDate || 0,
        ).getTime()

        const dateB = new Date(
          b.issueDate || 0,
        ).getTime()

        return dateB - dateA
      })
      .slice(0, 5)
  }, [data.certificates])

  // =========================================================
  // FORMATEAR FECHA
  // =========================================================

  const formatDate = (
    date?: string | null,
  ) => {
    if (!date) {
      return 'Sin fecha'
    }

    const parsed = new Date(date)

    if (Number.isNaN(parsed.getTime())) {
      return 'Sin fecha'
    }

    return parsed.toLocaleDateString(
      'es-CL',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      },
    )
  }

  // =========================================================
  // TEXTO DEL ESTADO
  // =========================================================

  const getStatusLabel = (
    status: CertificateStatus,
  ) => {
    switch (status) {
      case 'VALID':
        return 'Vigente'

      case 'EXPIRED':
        return 'Vencido'

      case 'DRAFT':
        return 'Borrador'

      case 'REVOKED':
        return 'Revocado'

      case 'CANCELLED':
        return 'Cancelado'

      default:
        return status
    }
  }

  // =========================================================
  // INTERFAZ
  // =========================================================

  return (
    <div className="admin-dashboard">

      {/* =====================================================
          ENCABEZADO
         ===================================================== */}

      <div className="admin-page-header">

        <div>
          <span className="admin-eyebrow">
            PANEL DE CONTROL
          </span>

          <h1>
            Dashboard
          </h1>

          <p>
            Gestión y seguimiento de certificados
            emitidos por Servicios Marítimos Bordemar SPA.
          </p>
        </div>

        <button
          className="admin-primary-button"
          onClick={() =>
            navigate(
              '/admin/certificados',
            )
          }
        >
          + Nuevo certificado
        </button>

      </div>

      {/* =====================================================
          MENSAJE DE ERROR
         ===================================================== */}

      {error && (
        <div
          style={{
            marginBottom: '20px',
            padding: '14px 16px',
            borderRadius: '8px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
          }}
        >
          {error}
        </div>
      )}

      {/* =====================================================
          TARJETAS DE ESTADÍSTICAS
         ===================================================== */}

      <div className="admin-stats">

        <div className="admin-stat-card">

          <span>
            Total certificados
          </span>

          <strong>
            {loading
              ? '...'
              : statistics.total}
          </strong>

          <small>
            Certificados registrados
          </small>

        </div>

        <div className="admin-stat-card">

          <span>
            Vigentes
          </span>

          <strong>
            {loading
              ? '...'
              : statistics.valid}
          </strong>

          <small>
            Actualmente válidos
          </small>

        </div>

        <div className="admin-stat-card">

          <span>
            Por vencer
          </span>

          <strong>
            {loading
              ? '...'
              : statistics.expiringSoon}
          </strong>

          <small>
            Próximos 30 días
          </small>

        </div>

        <div className="admin-stat-card">

          <span>
            Vencidos
          </span>

          <strong>
            {loading
              ? '...'
              : statistics.expired}
          </strong>

          <small>
            Fuera de vigencia
          </small>

        </div>

      </div>

      {/* =====================================================
          PANEL INFERIOR
         ===================================================== */}

      <div className="admin-dashboard-grid">

        {/* ===================================================
            CERTIFICADOS RECIENTES
           =================================================== */}

        <section className="admin-panel admin-recent">

          <div className="admin-panel-header">

            <div>

              <h2>
                Certificados recientes
              </h2>

              <p>
                Últimos documentos registrados
                en el sistema.
              </p>

            </div>

            <button
              className="admin-text-button"
              onClick={() =>
                navigate(
                  '/admin/certificados',
                )
              }
            >
              Ver todos
            </button>

          </div>

          {/* =================================================
              CARGANDO
             ================================================= */}

          {loading && (
            <div className="admin-empty-state">

              <h3>
                Cargando información...
              </h3>

              <p>
                Consultando BORDEMAR CERT API.
              </p>

            </div>
          )}

          {/* =================================================
              SIN CERTIFICADOS
             ================================================= */}

          {!loading &&
            recentCertificates.length === 0 && (

              <div className="admin-empty-state">

                <div className="admin-empty-icon">
                  ▤
                </div>

                <h3>
                  No existen certificados registrados
                </h3>

                <p>
                  Cuando emitas tu primer certificado
                  aparecerá aquí junto con su nave,
                  equipo, estado y fecha de vencimiento.
                </p>

              </div>

            )}

          {/* =================================================
              CERTIFICADOS REGISTRADOS
             ================================================= */}

          {!loading &&
            recentCertificates.length > 0 && (

              <div
                style={{
                  padding: '10px 24px 24px',
                }}
              >

                {recentCertificates.map(
                  (certificate) => (

                    <div
                      key={certificate.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          '1.2fr 1fr 1fr auto',
                        gap: '16px',
                        alignItems: 'center',
                        padding: '16px 0',
                        borderBottom:
                          '1px solid #e2e8f0',
                      }}
                    >

                      {/* CERTIFICADO */}

                      <div>

                        <strong
                          style={{
                            display: 'block',
                          }}
                        >
                          {
                            certificate.certificateNumber
                          }
                        </strong>

                        <small>
                          {
                            certificate.title ||
                            certificate.certificateType ||
                            'Certificado'
                          }
                        </small>

                      </div>

                      {/* NAVE */}

                      <div>

                        <small>
                          Nave
                        </small>

                        <strong
                          style={{
                            display: 'block',
                          }}
                        >
                          {
                            certificate.vessel?.name ||
                            'Sin nave'
                          }
                        </strong>

                      </div>

                      {/* VENCIMIENTO */}

                      <div>

                        <small>
                          Vencimiento
                        </small>

                        <strong
                          style={{
                            display: 'block',
                          }}
                        >
                          {
                            formatDate(
                              certificate.expirationDate,
                            )
                          }
                        </strong>

                      </div>

                      {/* ESTADO */}

                      <div>

                        <strong>
                          {
                            getStatusLabel(
                              certificate.status,
                            )
                          }
                        </strong>

                      </div>

                    </div>

                  ),
                )}

              </div>

            )}

        </section>

        {/* ===================================================
            RESUMEN GENERAL
           =================================================== */}

        <aside className="admin-panel admin-summary">

          <div className="admin-panel-header">

            <div>

              <h2>
                Resumen
              </h2>

              <p>
                Registros de BORDEMAR CERT.
              </p>

            </div>

          </div>

          <div className="admin-summary-list">

            <div>

              <span>
                Clientes
              </span>

              <strong>
                {loading
                  ? '...'
                  : data.clients.length}
              </strong>

            </div>

            <div>

              <span>
                Naves
              </span>

              <strong>
                {loading
                  ? '...'
                  : data.vessels.length}
              </strong>

            </div>

            <div>

              <span>
                Equipos
              </span>

              <strong>
                {loading
                  ? '...'
                  : data.equipment.length}
              </strong>

            </div>

            <div>

              <span>
                Certificados
              </span>

              <strong>
                {loading
                  ? '...'
                  : data.certificates.length}
              </strong>

            </div>

          </div>

        </aside>

      </div>

    </div>
  )
}