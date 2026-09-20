import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import './VerificarCertificado.css'

// =========================================================
// TIPOS
// =========================================================

type CertificateStatus =
  | 'DRAFT'
  | 'VALID'
  | 'EXPIRED'
  | 'REVOKED'
  | 'CANCELLED'

type DocumentIntegrity =
  | 'VERIFIED'
  | 'NOT_AVAILABLE'
  | 'MISMATCH'

interface CertificadoVerificado {
  valid: boolean

  status: CertificateStatus

  certificateNumber: string
  verificationCode: string
  certificateType: string
  title: string | null

  issueDate: string
  expirationDate: string | null

  vessel: {
    name: string
    registration: string
    callSign: string | null
    vesselType: string | null
  }

  equipment: {
    name: string
    category: string | null
    brand: string | null
    model: string | null
    serialNumber: string | null
  } | null

  issuedBy: string | null
  signedBy: string | null
  signatureDate: string | null

  statusReason: string | null
  statusChangedAt: string | null
  statusChangedBy: string | null

  documentIntegrity: DocumentIntegrity
  documentHash: string | null
  pdfUrl: string | null
}

// =========================================================
// URL API
//
// DESARROLLO:
// http://localhost:3000
//
// PRODUCCIÓN:
// posteriormente configuraremos VITE_CERT_API_URL
// =========================================================

const API_URL =
  import.meta.env.VITE_CERT_API_URL ||
  'http://localhost:3000'

// =========================================================
// FORMATEAR FECHA
// =========================================================

function formatearFecha(
  fecha: string | null,
) {
  if (!fecha) {
    return 'No registra'
  }

  const date =
    new Date(fecha)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return fecha
  }

  return new Intl.DateTimeFormat(
    'es-CL',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    },
  ).format(date)
}

// =========================================================
// TRADUCIR ESTADO
// =========================================================

function obtenerEstado(
  status: CertificateStatus,
) {
  switch (status) {
    case 'VALID':
      return 'VIGENTE'

    case 'EXPIRED':
      return 'VENCIDO'

    case 'REVOKED':
      return 'REVOCADO'

    case 'CANCELLED':
      return 'ANULADO'

    case 'DRAFT':
      return 'BORRADOR'

    default:
      return status
  }
}

// =========================================================
// TRADUCIR INTEGRIDAD
// =========================================================

function obtenerIntegridad(
  integrity: DocumentIntegrity,
) {
  switch (integrity) {
    case 'VERIFIED':
      return 'VERIFICADA'

    case 'MISMATCH':
      return 'NO VERIFICADA'

    case 'NOT_AVAILABLE':
      return 'NO DISPONIBLE'

    default:
      return integrity
  }
}

// =========================================================
// COMPONENTE
// =========================================================

export default function VerificarCertificado() {
  // =======================================================
  // PARÁMETRO DEL QR
  //
  // Ejemplo:
  //
  // /verificar-certificado?codigo=BMC-790BC1C5
  // =======================================================

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams()

  const codigoUrl =
    searchParams.get(
      'codigo',
    ) || ''

  // =======================================================
  // ESTADOS
  // =======================================================

  const [
    busqueda,
    setBusqueda,
  ] = useState(
    codigoUrl,
  )

  const [
    certificado,
    setCertificado,
  ] =
    useState<CertificadoVerificado | null>(
      null,
    )

  const [
    buscado,
    setBuscado,
  ] =
    useState(false)

  const [
    cargando,
    setCargando,
  ] =
    useState(false)

  const [
    mensajeError,
    setMensajeError,
  ] =
    useState('')

  // =======================================================
  // VERIFICAR CERTIFICADO
  // =======================================================

  const verificar = async (
    codigo?: string,
  ) => {
    const valor =
      (
        codigo ??
        busqueda
      )
        .trim()
        .toUpperCase()

    // -----------------------------------------------------
    // VALIDAR CAMPO
    // -----------------------------------------------------

    if (!valor) {
      setCertificado(
        null,
      )

      setBuscado(
        true,
      )

      setMensajeError(
        'Ingrese el número del certificado o el código de verificación.',
      )

      return
    }

    try {
      setCargando(
        true,
      )

      setBuscado(
        false,
      )

      setCertificado(
        null,
      )

      setMensajeError(
        '',
      )

      // ---------------------------------------------------
      // CONSULTAR BORDEMAR CERT API
      // ---------------------------------------------------

      const response =
        await fetch(
          `${API_URL}/certificates/verify/${encodeURIComponent(
            valor,
          )}`,
        )

      // ---------------------------------------------------
      // CERTIFICADO NO ENCONTRADO
      // ---------------------------------------------------

      if (
        response.status ===
        404
      ) {
        throw new Error(
          'El número o código ingresado no corresponde a un certificado registrado por Servicios Marítimos Bordemar SPA.',
        )
      }

      // ---------------------------------------------------
      // OTRO ERROR API
      // ---------------------------------------------------

      if (
        !response.ok
      ) {
        throw new Error(
          'No fue posible verificar el certificado en este momento.',
        )
      }

      // ---------------------------------------------------
      // LEER RESPUESTA
      // ---------------------------------------------------

      const data:
        CertificadoVerificado =
        await response.json()

      setCertificado(
        data,
      )

      setBuscado(
        true,
      )
    } catch (error) {
      setCertificado(
        null,
      )

      setBuscado(
        true,
      )

      if (
        error instanceof
        Error
      ) {
        setMensajeError(
          error.message,
        )
      } else {
        setMensajeError(
          'No fue posible verificar el certificado.',
        )
      }
    } finally {
      setCargando(
        false,
      )
    }
  }

  // =======================================================
  // VERIFICACIÓN AUTOMÁTICA DESDE QR
  //
  // Si entra:
  //
  // ?codigo=BMC-790BC1C5
  //
  // verifica automáticamente.
  // =======================================================

  useEffect(() => {
    if (
      codigoUrl
    ) {
      void verificar(
        codigoUrl,
      )
    }

    // Solo queremos ejecutarlo al cargar la página.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // =======================================================
  // FORMULARIO
  // =======================================================

  const handleSubmit = (
    event:
      FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const valor =
      busqueda
        .trim()
        .toUpperCase()

    setBusqueda(
      valor,
    )

    // -----------------------------------------------------
    // ACTUALIZAR URL
    // -----------------------------------------------------

    if (
      valor
    ) {
      setSearchParams({
        codigo:
          valor,
      })
    }

    void verificar(
      valor,
    )
  }

  // =======================================================
  // ABRIR PDF
  // =======================================================

  const abrirPdf = () => {
    if (
      !certificado?.pdfUrl
    ) {
      return
    }

    const url =
      certificado.pdfUrl.startsWith(
        'http',
      )
        ? certificado.pdfUrl
        : `${API_URL}${certificado.pdfUrl}`

    window.open(
      url,
      '_blank',
      'noopener,noreferrer',
    )
  }

  // =======================================================
  // MARCA / MODELO
  // =======================================================

  const marcaModelo =
    certificado?.equipment
      ? [
          certificado
            .equipment
            .brand,

          certificado
            .equipment
            .model,
        ]
          .filter(
            Boolean,
          )
          .join(
            ' / ',
          ) ||
        'No registra'
      : 'No aplica'

  // =======================================================
  // PRESENTACIÓN SEGÚN ESTADO
  // =======================================================

  const presentacionEstado = (() => {
    if (!certificado) {
      return { icono: '!', titulo: '', mensaje: '', color: '#64748b', fondo: '#f8fafc' }
    }

    switch (certificado.status) {
      case 'VALID':
        return {
          icono: '✓',
          titulo: 'Certificado VIGENTE',
          mensaje: 'El certificado consultado se encuentra registrado, vigente y con su integridad documental verificada por Servicios Marítimos Bordemar SPA.',
          color: '#15803d',
          fondo: '#f0fdf4',
        }
      case 'EXPIRED':
        return {
          icono: '!',
          titulo: 'Certificado VENCIDO',
          mensaje: 'El certificado fue emitido por Servicios Marítimos Bordemar SPA, pero su fecha de vigencia ha expirado. El documento histórico puede mantenerse disponible para fines de trazabilidad.',
          color: '#d97706',
          fondo: '#fffbeb',
        }
      case 'REVOKED':
        return {
          icono: '!',
          titulo: 'Certificado REVOCADO',
          mensaje: 'Este certificado fue emitido originalmente, pero posteriormente fue revocado. No debe considerarse vigente. El documento histórico permanece disponible para fines de trazabilidad.',
          color: '#b91c1c',
          fondo: '#fef2f2',
        }
      case 'CANCELLED':
        return {
          icono: '!',
          titulo: 'Certificado ANULADO',
          mensaje: 'Este registro fue anulado antes de su emisión definitiva y no debe considerarse un certificado vigente.',
          color: '#7f1d1d',
          fondo: '#fff1f2',
        }
      default:
        return {
          icono: '!',
          titulo: `Certificado ${obtenerEstado(certificado.status)}`,
          mensaje: 'Este registro todavía no constituye un certificado vigente.',
          color: '#64748b',
          fondo: '#f8fafc',
        }
    }
  })()

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <main className="verificacion-page">

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="verificacion-hero">
        <div className="verificacion-hero-overlay">
          <div className="verificacion-container">

            <span className="verificacion-etiqueta">
              SERVICIOS MARÍTIMOS BORDEMAR SPA
            </span>

            <h1>
              Verificación de Certificados
            </h1>

            <p>
              Compruebe la autenticidad, vigencia e
              integridad de certificados emitidos por
              Servicios Marítimos Bordemar SPA.
            </p>

          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* CONTENIDO */}
      {/* ================================================= */}

      <section className="verificacion-contenido">
        <div className="verificacion-container">

          {/* ============================================= */}
          {/* BUSCADOR */}
          {/* ============================================= */}

          <div className="verificacion-buscador">

            <h2>
              Verificar certificado
            </h2>

            <p>
              Ingrese el número del certificado o el
              código de verificación indicado junto al
              código QR.
            </p>

            <form
              onSubmit={
                handleSubmit
              }
            >
              <div className="verificacion-input-row">

                <input
                  type="text"
                  value={
                    busqueda
                  }
                  onChange={(
                    event,
                  ) =>
                    setBusqueda(
                      event
                        .target
                        .value,
                    )
                  }
                  placeholder="Ej: BMC-790BC1C5 o SMB-2026-0001"
                  aria-label="Número o código de certificado"
                  autoComplete="off"
                />

                <button
                  type="submit"
                  disabled={
                    cargando
                  }
                >
                  {cargando
                    ? 'Verificando...'
                    : 'Verificar'}
                </button>

              </div>
            </form>

            <small>
              También puede acceder directamente
              escaneando el código QR incorporado en
              el certificado.
            </small>

          </div>

          {/* ============================================= */}
          {/* CARGANDO */}
          {/* ============================================= */}

          {cargando && (
            <div className="certificado-resultado">

              <div className="certificado-estado">

                <div className="certificado-check">
                  …
                </div>

                <div>
                  <span>
                    BORDEMAR CERT
                  </span>

                  <h2>
                    Verificando certificado
                  </h2>

                  <p>
                    Comprobando registro, vigencia e
                    integridad documental.
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* ============================================= */}
          {/* RESULTADO */}
          {/* ============================================= */}

          {!cargando &&
            buscado &&
            certificado && (
              <div className="certificado-resultado">

                {/* ======================================= */}
                {/* ESTADO */}
                {/* ======================================= */}

                <div
                  className="certificado-estado"
                  style={{
                    borderLeft: `5px solid ${presentacionEstado.color}`,
                    background: presentacionEstado.fondo,
                  }}
                >
                  <div
                    className="certificado-check"
                    style={{
                      background: presentacionEstado.color,
                      color: '#ffffff',
                    }}
                  >
                    {presentacionEstado.icono}
                  </div>

                  <div>
                    <span>RESULTADO DE VERIFICACIÓN</span>

                    <h2>
                      {presentacionEstado.titulo}
                    </h2>

                    <p>
                      {presentacionEstado.mensaje}
                    </p>
                  </div>
                </div>

                {/* ======================================= */}
                {/* INFORMACIÓN DEL CERTIFICADO */}
                {/* ======================================= */}

                {(certificado.status === 'REVOKED' ||
                  certificado.status === 'CANCELLED') && (
                  <div
                    style={{
                      margin: '18px 0',
                      padding: '16px 18px',
                      borderRadius: '10px',
                      border: certificado.status === 'REVOKED'
                        ? '1px solid #fecaca'
                        : '1px solid #e2e8f0',
                      background: certificado.status === 'REVOKED'
                        ? '#fff7f7'
                        : '#f8fafc',
                    }}
                  >
                    <strong
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: certificado.status === 'REVOKED'
                          ? '#991b1b'
                          : '#334155',
                      }}
                    >
                      {certificado.status === 'REVOKED'
                        ? 'Información de revocación'
                        : 'Información de anulación'}
                    </strong>

                    <p style={{ margin: '0 0 7px' }}>
                      <strong>Motivo:</strong>{' '}
                      {certificado.statusReason || 'No registra motivo.'}
                    </p>

                    <p style={{ margin: '0 0 7px' }}>
                      <strong>
                        {certificado.status === 'REVOKED'
                          ? 'Fecha de revocación:'
                          : 'Fecha de anulación:'}
                      </strong>{' '}
                      {formatearFecha(certificado.statusChangedAt)}
                    </p>

                    {certificado.statusChangedBy && (
                      <p style={{ margin: 0 }}>
                        <strong>Registrado por:</strong>{' '}
                        {certificado.statusChangedBy}
                      </p>
                    )}
                  </div>
                )}

                <div className="certificado-grid">

                  <div>
                    <span>
                      N.º de certificado
                    </span>

                    <strong>
                      {
                        certificado
                          .certificateNumber
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Código de verificación
                    </span>

                    <strong>
                      {
                        certificado
                          .verificationCode
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Tipo de certificado
                    </span>

                    <strong>
                      {
                        certificado
                          .certificateType
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Estado
                    </span>

                    <strong>
                      {obtenerEstado(
                        certificado.status,
                      )}
                    </strong>
                  </div>

                  {/* ===================================== */}
                  {/* NAVE */}
                  {/* ===================================== */}

                  <div>
                    <span>
                      Nave
                    </span>

                    <strong>
                      {
                        certificado
                          .vessel
                          .name
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Matrícula
                    </span>

                    <strong>
                      {
                        certificado
                          .vessel
                          .registration
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Señal de llamada
                    </span>

                    <strong>
                      {certificado
                        .vessel
                        .callSign ||
                        'No registra'}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Tipo de nave
                    </span>

                    <strong>
                      {certificado
                        .vessel
                        .vesselType ||
                        'No registra'}
                    </strong>
                  </div>

                  {/* ===================================== */}
                  {/* EQUIPO */}
                  {/* ===================================== */}

                  <div>
                    <span>
                      Equipo
                    </span>

                    <strong>
                      {certificado
                        .equipment
                        ?.name ||
                        'No aplica'}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Marca / Modelo
                    </span>

                    <strong>
                      {
                        marcaModelo
                      }
                    </strong>
                  </div>

                  {/* ===================================== */}
                  {/* FECHAS */}
                  {/* ===================================== */}

                  <div>
                    <span>
                      Fecha de emisión
                    </span>

                    <strong>
                      {formatearFecha(
                        certificado
                          .issueDate,
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Fecha de vencimiento
                    </span>

                    <strong>
                      {formatearFecha(
                        certificado
                          .expirationDate,
                      )}
                    </strong>
                  </div>

                  {/* ===================================== */}
                  {/* EMISIÓN */}
                  {/* ===================================== */}

                  <div>
                    <span>
                      Emitido por
                    </span>

                    <strong>
                      {certificado
                        .issuedBy ||
                        'Servicios Marítimos Bordemar SPA'}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Responsable / Firmante
                    </span>

                    <strong>
                      {certificado
                        .signedBy ||
                        'No registra'}
                    </strong>
                  </div>

                  {/* ===================================== */}
                  {/* INTEGRIDAD */}
                  {/* ===================================== */}

                  <div>
                    <span>
                      Integridad documental
                    </span>

                    <strong>
                      {obtenerIntegridad(
                        certificado
                          .documentIntegrity,
                      )}
                    </strong>
                  </div>

                </div>

                {/* ======================================= */}
                {/* CÓDIGO DE VERIFICACIÓN */}
                {/* ======================================= */}

                <div className="certificado-codigo">

                  Código de verificación:

                  <strong>
                    {
                      certificado
                        .verificationCode
                    }
                  </strong>

                </div>

                {/* ======================================= */}
                {/* HASH SHA-256 */}
                {/* ======================================= */}

                {certificado.documentHash && (
                  <div
                    className="certificado-codigo"
                    style={{
                      marginTop:
                        '12px',
                      wordBreak:
                        'break-all',
                    }}
                  >

                    Huella digital SHA-256:

                    <strong>
                      {
                        certificado
                          .documentHash
                      }
                    </strong>

                  </div>
                )}

                {/* ======================================= */}
                {/* PDF */}
                {/* ======================================= */}

                {certificado.pdfUrl &&
                  certificado.documentIntegrity ===
                    'VERIFIED' && (
                    <div
                      style={{
                        marginTop:
                          '22px',
                      }}
                    >

                      <button
                        type="button"
                        onClick={
                          abrirPdf
                        }
                        style={{
                          border:
                            'none',
                          borderRadius:
                            '8px',
                          padding:
                            '13px 22px',
                          background:
                            '#075985',
                          color:
                            '#ffffff',
                          fontWeight:
                            700,
                          cursor:
                            'pointer',
                        }}
                      >
                        Ver certificado PDF
                      </button>

                    </div>
                  )}

              </div>
            )}

          {/* ============================================= */}
          {/* NO ENCONTRADO */}
          {/* ============================================= */}

          {!cargando &&
            buscado &&
            !certificado && (
              <div className="certificado-no-encontrado">

                <div className="certificado-error">
                  !
                </div>

                <div>

                  <h2>
                    Certificado no encontrado
                  </h2>

                  <p>
                    {mensajeError ||
                      'El número o código ingresado no corresponde a un certificado registrado por Servicios Marítimos Bordemar SPA.'}
                  </p>

                  <p>
                    Revise los datos indicados en el
                    documento e intente nuevamente.
                  </p>

                </div>

              </div>
            )}

          {/* ============================================= */}
          {/* AYUDA */}
          {/* ============================================= */}

          <div className="verificacion-ayuda">

            <div>
              <h3>
                ¿Dónde encuentro el código?
              </h3>

              <p>
                El número de certificado SMB y el
                código de verificación BMC se
                encuentran incorporados en el
                certificado emitido por Bordemar.
              </p>
            </div>

            <div>
              <h3>
                ¿Qué significa esta verificación?
              </h3>

              <p>
                Permite comprobar que el certificado
                corresponde a un registro de BORDEMAR
                CERT y verificar la integridad del
                documento almacenado.
              </p>
            </div>

            <div>
              <h3>
                ¿Necesita asistencia?
              </h3>

              <p>
                Si detecta alguna diferencia entre el
                certificado presentado y este registro,
                contacte directamente a Servicios
                Marítimos Bordemar SPA.
              </p>
            </div>

          </div>

        </div>
      </section>

    </main>
  )
}