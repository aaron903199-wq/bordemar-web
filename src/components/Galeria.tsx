import { useEffect, useRef, useState } from 'react'

import radar from '../assets/galeria/instalacion de radar.jpeg'
import mantenimiento from '../assets/galeria/mantenimiento.jpeg'
import grua from '../assets/galeria/pruebas de grua.jpeg'
import ancla from '../assets/galeria/confeccion de ancla.jpeg'

import certificaciones from '../assets/galeria/CERTIFICACIONES EQUIPAMIENTO.jpeg'
import gpsGarmin from '../assets/galeria/GPS GARMIN.jpeg'
import inspeccionNave from '../assets/galeria/inspeccion de nave.jpeg'
import inspeccion from '../assets/galeria/INSPECCION.jpeg'
import medicionesGenerador from '../assets/galeria/MEDICIONES GENERADOR.jpeg'
import regularizacion from '../assets/galeria/REGULARIZACIÓN DOCUMENTACIÓN.jpeg'
import tuboIncinerador from '../assets/galeria/TURBO INCINERADOR BUQUE FACTORIA.jpeg'

const trabajos = [
  {
    imagen: radar,
    categoria: 'Electrónica marina',
    titulo: 'Instalación de radar',
    descripcion:
      'Instalación y trabajos técnicos realizados en equipos de navegación a bordo.',
  },
  {
    imagen: gpsGarmin,
    categoria: 'Electrónica marina',
    titulo: 'Equipamiento GPS Garmin',
    descripcion:
      'Instalación, revisión y configuración de equipamiento de navegación marítima.',
    claseImagen: 'gallery-image-garmin',
  },
  {
    imagen: mantenimiento,
    categoria: 'Mantenimiento',
    titulo: 'Mantenimiento de equipos',
    descripcion:
      'Trabajos de inspección, reparación y mantenimiento de equipos marítimos.',
  },
  {
    imagen: grua,
    categoria: 'Equipos de cubierta',
    titulo: 'Pruebas de grúa',
    descripcion:
      'Inspecciones, verificaciones y pruebas operacionales de equipos de cubierta.',
  },
  {
    imagen: ancla,
    categoria: 'Maestranza',
    titulo: 'Confección de anclas',
    descripcion:
      'Fabricación y trabajos de maestranza orientados a requerimientos marítimos.',
  },
  {
    imagen: inspeccionNave,
    categoria: 'Inspecciones',
    titulo: 'Inspección de nave',
    descripcion:
      'Revisión técnica y operacional de embarcaciones y sus principales sistemas.',
  },
  {
    imagen: inspeccion,
    categoria: 'Inspecciones',
    titulo: 'Inspección técnica',
    descripcion:
      'Verificación de equipos, condiciones operacionales y cumplimiento de requerimientos.',
  },
  {
    imagen: certificaciones,
    categoria: 'Certificaciones',
    titulo: 'Certificación de equipamiento',
    descripcion:
      'Apoyo técnico para inspección, regularización y certificación de equipos marítimos.',
  },
  {
    imagen: medicionesGenerador,
    categoria: 'Equipamiento',
    titulo: 'Mediciones de generador',
    descripcion:
      'Mediciones, verificaciones y revisión de parámetros de equipos generadores.',
  },
  {
    imagen: regularizacion,
    categoria: 'Documentación marítima',
    titulo: 'Regularización documental',
    descripcion:
      'Gestión y apoyo documental para la regularización de naves y equipamiento marítimo.',
  },
  {
    imagen: tuboIncinerador,
    categoria: 'Mantenimiento industrial',
    titulo: 'Trabajo en incinerador de buque factoría',
    descripcion:
      'Reparación y mantenimiento de componentes asociados a sistemas de incineración a bordo.',
  },
]

export default function Galeria() {
  const carouselRef = useRef<HTMLDivElement>(null)

  const [pausado, setPausado] = useState(false)

  const moverGaleria = (direccion: 'izquierda' | 'derecha') => {
    const carrusel = carouselRef.current

    if (!carrusel) return

    const desplazamiento = carrusel.clientWidth * 0.78

    carrusel.scrollBy({
      left:
        direccion === 'derecha'
          ? desplazamiento
          : -desplazamiento,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    if (pausado) return

    const intervalo = window.setInterval(() => {
      const carrusel = carouselRef.current

      if (!carrusel) return

      const llegoAlFinal =
        carrusel.scrollLeft + carrusel.clientWidth >=
        carrusel.scrollWidth - 10

      if (llegoAlFinal) {
        carrusel.scrollTo({
          left: 0,
          behavior: 'smooth',
        })
      } else {
        carrusel.scrollBy({
          left: carrusel.clientWidth * 0.78,
          behavior: 'smooth',
        })
      }
    }, 4500)

    return () => {
      window.clearInterval(intervalo)
    }
  }, [pausado])

  return (
    <section className="gallery-section" id="galeria">
      <div className="container">

        <div className="gallery-heading">
          <div>
            <p className="section-eyebrow">GALERÍA</p>

            <h2>
              Así se ven
              <span>nuestros trabajos</span>
            </h2>
          </div>

          <p className="gallery-intro">
            Imágenes reales de proyectos, instalaciones,
            mantenimiento, inspecciones y servicios realizados
            en terreno.
          </p>
        </div>

        <div
          className="gallery-carousel-shell"
          onMouseEnter={() => setPausado(true)}
          onMouseLeave={() => setPausado(false)}
        >
          <button
            type="button"
            className="gallery-arrow gallery-arrow-left"
            onClick={() => moverGaleria('izquierda')}
            aria-label="Ver trabajos anteriores"
          >
            ‹
          </button>

          <div
            className="gallery-carousel"
            ref={carouselRef}
          >
            {trabajos.map((trabajo, index) => (
              <article
                className="gallery-slide"
                key={`${trabajo.titulo}-${index}`}
              >
                <img
                  src={trabajo.imagen}
                  alt={trabajo.titulo}
                  loading="lazy"
                  className={trabajo.claseImagen || ''}
                />

                <div className="gallery-slide-overlay">
                  <div className="gallery-slide-line"></div>

                  <span className="gallery-slide-category">
                    {trabajo.categoria}
                  </span>

                  <h3>{trabajo.titulo}</h3>

                  <p>{trabajo.descripcion}</p>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="gallery-arrow gallery-arrow-right"
            onClick={() => moverGaleria('derecha')}
            aria-label="Ver siguientes trabajos"
          >
            ›
          </button>
        </div>

        <p className="gallery-hint">
          La galería avanza automáticamente. También puedes usar las flechas.
        </p>

      </div>
    </section>
  )
}