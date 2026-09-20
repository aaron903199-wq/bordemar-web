import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import './Admin.css'

type LoginResponse = {
  accessToken: string
}

const API_URL =
  import.meta.env.VITE_CERT_API_URL ||
  'http://localhost:3000'

export default function AdminLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setError('')

    const emailLimpio = email.trim().toLowerCase()

    if (!emailLimpio || !password) {
      setError(
        'Ingrese su correo electrónico y contraseña.',
      )
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: emailLimpio,
            password,
          }),
        },
      )

      if (!response.ok) {
        if (
          response.status === 401 ||
          response.status === 403
        ) {
          throw new Error(
            'Correo electrónico o contraseña incorrectos.',
          )
        }

        throw new Error(
          'No fue posible iniciar sesión.',
        )
      }

      const data =
        (await response.json()) as LoginResponse

      if (!data.accessToken) {
        throw new Error(
          'El servidor no entregó un token de acceso.',
        )
      }

      localStorage.setItem(
        'bordemar_cert_token',
        data.accessToken,
      )

      navigate('/admin', {
        replace: true,
      })
    } catch (error) {
      console.error(
        'Error al iniciar sesión:',
        error,
      )

      if (error instanceof TypeError) {
        setError(
          'No fue posible conectar con BORDEMAR CERT API.',
        )
      } else if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(
          'Ocurrió un error al iniciar sesión.',
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #06283d 0%, #0b4f71 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: '430px',
          background: '#ffffff',
          borderRadius: '14px',
          boxShadow:
            '0 20px 60px rgba(0, 0, 0, 0.25)',
          padding: '38px',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: '30px',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '1.5px',
              color: '#0b5f89',
              marginBottom: '8px',
            }}
          >
            SERVICIOS MARÍTIMOS BORDEMAR SPA
          </div>

          <h1
            style={{
              margin: 0,
              color: '#06283d',
              fontSize: '30px',
              fontWeight: 800,
            }}
          >
            BORDEMAR CERT
          </h1>

          <p
            style={{
              marginTop: '10px',
              marginBottom: 0,
              color: '#64748b',
              fontSize: '14px',
              lineHeight: 1.5,
            }}
          >
            Acceso al sistema de administración
            de certificados.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              marginBottom: '18px',
            }}
          >
            <label
              htmlFor="admin-email"
              style={{
                display: 'block',
                marginBottom: '7px',
                color: '#334155',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              Correo electrónico
            </label>

            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="username"
              placeholder="correo@bordemar.cl"
              disabled={loading}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                height: '46px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0 13px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div
            style={{
              marginBottom: '20px',
            }}
          >
            <label
              htmlFor="admin-password"
              style={{
                display: 'block',
                marginBottom: '7px',
                color: '#334155',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              Contraseña
            </label>

            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              placeholder="Ingrese su contraseña"
              disabled={loading}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                height: '46px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0 13px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {error && (
            <div
              role="alert"
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                borderRadius: '8px',
                padding: '11px 13px',
                fontSize: '13px',
                lineHeight: 1.5,
                marginBottom: '18px',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: '47px',
              border: 0,
              borderRadius: '8px',
              background: loading
                ? '#64748b'
                : '#075985',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 800,
              cursor: loading
                ? 'not-allowed'
                : 'pointer',
            }}
          >
            {loading
              ? 'Ingresando...'
              : 'Ingresar a BORDEMAR CERT'}
          </button>
        </form>

        <div
          style={{
            marginTop: '25px',
            paddingTop: '20px',
            borderTop: '1px solid #e2e8f0',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              margin: 0,
              color: '#94a3b8',
              fontSize: '12px',
              lineHeight: 1.5,
            }}
          >
            Acceso restringido a personal
            autorizado de Servicios Marítimos
            Bordemar SPA.
          </p>
        </div>
      </section>
    </main>
  )
}