export default function WhatsAppButton() {
  const whatsappUrl =
    'https://wa.me/56945852433?text=Hola%20Servicios%20Mar%C3%ADtimos%20Bordemar%20SPA%2C%20necesito%20informaci%C3%B3n%20sobre%20sus%20servicios.'

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Contactar a Servicios Marítimos Bordemar SPA por WhatsApp"
      title="Contactar por WhatsApp"
    >
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="whatsapp-icon"
      >
        <path
          fill="currentColor"
          d="M16.04 3C8.86 3 3.02 8.82 3.02 15.98c0 2.29.6 4.52 1.73 6.48L3 29l6.72-1.76a13 13 0 0 0 6.31 1.61h.01c7.18 0 13.02-5.82 13.02-12.98C29.06 8.82 23.22 3 16.04 3Zm0 23.66h-.01a10.8 10.8 0 0 1-5.52-1.51l-.4-.24-3.99 1.04 1.07-3.88-.26-.4a10.72 10.72 0 0 1-1.67-5.69c0-5.96 4.86-10.8 10.83-10.8 5.97 0 10.82 4.84 10.82 10.8 0 5.95-4.85 10.68-10.87 10.68Zm5.94-8.07c-.33-.17-1.92-.95-2.22-1.05-.3-.11-.52-.17-.74.16-.22.33-.85 1.05-1.04 1.27-.19.22-.38.25-.71.08-.33-.16-1.38-.5-2.63-1.6-.97-.86-1.62-1.93-1.81-2.25-.19-.33-.02-.5.14-.66.15-.15.33-.38.49-.57.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.58-.08-.16-.74-1.79-1.02-2.45-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.58.08-.88.41-.3.33-1.15 1.12-1.15 2.73s1.18 3.17 1.34 3.39c.16.22 2.32 3.54 5.62 4.96.78.34 1.4.54 1.87.69.79.25 1.5.21 2.07.13.63-.09 1.92-.79 2.19-1.55.27-.76.27-1.41.19-1.55-.08-.14-.3-.22-.63-.38Z"
        />
      </svg>
    </a>
  )
}