import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

type ProtectedAdminRouteProps = {
  children: ReactNode
}

export default function ProtectedAdminRoute({
  children,
}: ProtectedAdminRouteProps) {
  const location = useLocation()

  const token = localStorage.getItem(
    'bordemar_cert_token',
  )

  // =========================================================
  // SIN TOKEN -> REDIRIGIR AL LOGIN
  // =========================================================

  if (!token) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    )
  }

  // =========================================================
  // CON TOKEN -> PERMITIR ACCESO
  // =========================================================

  return <>{children}</>
}