import { useRef } from 'react'

import ais800Garmin from '../assets/equipamiento/ais-800-garmin.jpg'
import ancla150kg from '../assets/equipamiento/ancla-acero-naval-150kg.jpeg'
import radarIcomMr1010 from '../assets/equipamiento/radar-icom-mr1010.jpeg'
import ais700Raymarine from '../assets/equipamiento/ais700-raymarine.webp'

import boteHdp from '../assets/equipamiento/bote-hdp.jpeg'
import radarGarminGmr18 from '../assets/equipamiento/radar-garmin-gmr18.png'
import garmin1022 from '../assets/equipamiento/garmin-1022.png'
import garmin923 from '../assets/equipamiento/garmin-923.png'
import garmin723 from '../assets/equipamiento/garmin-723.png'

type Equipo = {
  id: number
  nombre: string
  marca: string
  categoria: string
  descripcion: string
  precio: string
  precioAnterior?: string
  imagen: string
  alt: string
  disponible: boolean
  instalacionAutorizada?: boolean
}

const equipos: Equipo[] = [
  {
    id: 1,
    nombre: 'AIS 800',
    marca: 'Garmin',
    categoria: 'Electrónica marina · AIS',
    descripcion:
      'Sistema AIS para identificación y seguimiento de embarcaciones, orientado a mejorar la información disponible para la navegación y operación marítima.',
    precio: 'Consultar valor',
    imagen: ais800Garmin,
    alt: 'AIS 800 Garmin para embarcaciones disponible en Servicios Marítimos Bordemar SPA',
    disponible: true,
    instalacionAutorizada: true,
  },
  {
    id: 2,
    nombre: 'Ancla acero naval 150 kg',
    marca: 'Bordemar',
    categoria: 'Equipos de cubierta · Anclas',
    descripcion:
      'Ancla fabricada en acero naval con un peso aproximado de 150 kilos, destinada a embarcaciones y operaciones marítimas que requieran equipamiento robusto de cubierta.',
    precio: 'Consultar valor',
    imagen: ancla150kg,
    alt: 'Ancla de acero naval de 150 kilos para embarcaciones',
    disponible: true,
  },
  {
    id: 3,
    nombre: 'Radar MR-1010',
    marca: 'ICOM',
    categoria: 'Electrónica marina · Radar',
    descripcion:
      'Radar marino ICOM MR-1010 para apoyo a la navegación, detección de blancos y operación de embarcaciones en distintas condiciones de navegación.',
    precio: 'Consultar valor',
    imagen: radarIcomMr1010,
    alt: 'Radar marino ICOM MR-1010 instalado en embarcación',
    disponible: true,
    instalacionAutorizada: true,
  },
  {
    id: 4,
    nombre: 'AIS700',
    marca: 'Raymarine',
    categoria: 'Electrónica marina · AIS',
    descripcion:
      'Transceptor AIS Raymarine AIS700 para integración con sistemas electrónicos de navegación y seguimiento de tráfico marítimo a bordo.',
    precio: 'Consultar valor',
    imagen: ais700Raymarine,
    alt: 'Raymarine AIS700 para embarcaciones disponible en Servicios Marítimos Bordemar SPA',
    disponible: true,
    instalacionAutorizada: true,
  },
  {
    id: 5,
    nombre: 'Bote HDPE',
    marca: 'Equipamiento marítimo',
    categoria: 'Embarcaciones · HDPE',
    descripcion:
      'Bote fabricado en HDPE para apoyo operacional, traslado y trabajos marítimos, con estructura resistente para uso en condiciones exigentes.',
    precio: 'Consultar valor',
    imagen: boteHdp,
    alt: 'Bote HDPE para operaciones marítimas disponible en Servicios Marítimos Bordemar SPA',
    disponible: true,
  },
  {
    id: 6,
    nombre: 'Radar GMR 18',
    marca: 'Garmin',
    categoria: 'Electrónica marina · Radar',
    descripcion:
      'Radar Garmin GMR 18 para apoyo a la navegación y detección de blancos, diseñado para integración con sistemas electrónicos Garmin a bordo.',
    precio: 'Consultar valor',
    imagen: radarGarminGmr18,
    alt: 'Radar Garmin GMR 18 para embarcaciones',
    disponible: true,
    instalacionAutorizada: true,
  },
  {
    id: 7,
    nombre: 'GPSMAP 1022',
    marca: 'Garmin',
    categoria: 'Electrónica marina · Plotter',
    descripcion:
      'Pantalla multifunción Garmin GPSMAP 1022 para navegación, cartografía y visualización de información proveniente de sensores y equipos instalados a bordo.',
    precio: 'Consultar valor',
    imagen: garmin1022,
    alt: 'Garmin GPSMAP 1022 para navegación marítima',
    disponible: true,
    instalacionAutorizada: true,
  },
  {
    id: 8,
    nombre: 'GPSMAP 923',
    marca: 'Garmin',
    categoria: 'Electrónica marina · Plotter',
    descripcion:
      'Plotter Garmin GPSMAP 923 con pantalla multifunción para navegación y cartografía, preparado para integración con distintos equipos electrónicos marinos.',
    precio: 'Consultar valor',
    imagen: garmin923,
    alt: 'Garmin GPSMAP 923 para embarcaciones',
    disponible: true,
    instalacionAutorizada: true,
  },
  {
    id: 9,
    nombre: 'GPSMAP 723',
    marca: 'Garmin',
    categoria: 'Electrónica marina · Plotter',
    descripcion:
      'Plotter Garmin GPSMAP 723 para navegación y visualización de cartografía, pensado para integración con equipos y sensores electrónicos a bordo.',
    precio: 'Consultar valor',
    imagen: garmin723,
    alt: 'Garmin GPSMAP 723 para embarcaciones',
    disponible: true,
    instalacionAutorizada: true,
  },
]

export default function VentaEquipamiento() {
  const carruselRef = useRef<HTMLDivElement>(null)

  const crearWhatsapp = (equipo: Equipo) => {
    const mensaje =
      `Hola Servicios Marítimos Bordemar SPA, ` +
      `necesito información y cotización por ${equipo.nombre} ${equipo.marca}.`

    return `https://wa.me/56945852433?text=${encodeURIComponent(mensaje)}`
  }

  const moverCarrusel = (direccion: 'izquierda' | 'derecha') => {
    const carrusel = carruselRef.current

    if (!carrusel) return

    const tarjeta =
      carrusel.querySelector<HTMLElement>('.equipamiento-card')

    const desplazamiento =
      tarjeta
        ? tarjeta.offsetWidth + 26
        : carrusel.clientWidth * 0.8

    carrusel.scrollBy({
      left:
        direccion === 'derecha'
          ? desplazamiento
          : -desplazamiento,
      behavior: 'smooth',
    })
  }

  return (
    <section
      className="venta-equipamiento"
      id="equipamiento"
      aria-labelledby="titulo-equipamiento"
    >
      <div className="container">

        <div className="venta-equipamiento-header">

          <div>
            <p className="section-eyebrow">
              VENTA DE EQUIPAMIENTO MARÍTIMO
            </p>

            <h2 id="titulo-equipamiento">
              Equipamiento
              <span> para naves</span>
            </h2>
          </div>

          <div>
            <p className="venta-equipamiento-intro">
              Equipos, accesorios y soluciones para embarcaciones,
              armadores y empresas del sector marítimo y acuícola.
              Consulta disponibilidad, características técnicas
              y condiciones de venta directamente con Bordemar.
            </p>

            <p className="venta-equipamiento-intro">
              En equipamiento electrónico ofrecemos además coordinación
              de suministro, montaje, configuración y puesta en servicio
              mediante entidad técnica autorizada por DIRECTEMAR,
              según corresponda al equipo y requerimiento de la nave.
            </p>
          </div>

        </div>

        <div className="equipamiento-carousel-wrapper">

          <button
            type="button"
            className="equipamiento-arrow equipamiento-arrow-left"
            onClick={() => moverCarrusel('izquierda')}
            aria-label="Ver equipos anteriores"
          >
            ‹
          </button>

          <div
            className="equipamiento-carousel"
            ref={carruselRef}
          >

            {equipos.map((equipo) => (
              <article
                className="equipamiento-card"
                key={equipo.id}
              >

                <div className="equipamiento-imagen">

                  <img
                    src={equipo.imagen}
                    alt={equipo.alt}
                    loading="lazy"
                  />

                  {equipo.disponible && (
                    <span className="equipamiento-stock">
                      Disponible
                    </span>
                  )}

                </div>

                <div className="equipamiento-contenido">

                  <p className="equipamiento-categoria">
                    {equipo.categoria}
                  </p>

                  <h3>
                    {equipo.nombre}
                  </h3>

                  <p className="equipamiento-marca">
                    {equipo.marca}
                  </p>

                  <p className="equipamiento-descripcion">
                    {equipo.descripcion}
                  </p>

                  {equipo.instalacionAutorizada && (
                    <div className="equipamiento-instalacion">
                      <span aria-hidden="true">✓</span>

                      <p>
                        Equipamiento e instalación por entidad
                        técnica autorizada por DIRECTEMAR
                      </p>
                    </div>
                  )}

                  <div className="equipamiento-precios">

                    {equipo.precioAnterior && (
                      <span className="equipamiento-precio-anterior">
                        {equipo.precioAnterior}
                      </span>
                    )}

                    <strong className="equipamiento-precio">
                      {equipo.precio}
                    </strong>

                  </div>

                  <a
                    href={crearWhatsapp(equipo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button equipamiento-button"
                    aria-label={`Consultar por ${equipo.nombre} ${equipo.marca} en WhatsApp`}
                  >
                    Consultar por WhatsApp
                    <span aria-hidden="true">→</span>
                  </a>

                </div>

              </article>
            ))}

          </div>

          <button
            type="button"
            className="equipamiento-arrow equipamiento-arrow-right"
            onClick={() => moverCarrusel('derecha')}
            aria-label="Ver más equipos"
          >
            ›
          </button>

        </div>

        <p className="gallery-hint">
          Utiliza las flechas o desliza para conocer nuestro
          equipamiento disponible para naves.
        </p>

      </div>
    </section>
  )
}