import Header from './components/Header'
import Hero from './components/Hero'
import Nosotros from './components/Nosotros'
import Servicios from './components/Servicios'
import Proyectos from './components/Proyectos'
import Galeria from './components/Galeria'
import ArriendoNaves from './components/ArriendoNaves'
import Contacto from './components/Contacto'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'

export default function App() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Nosotros />
        <Servicios />
        <Proyectos />
        <Galeria />
        <ArriendoNaves />
        <Contacto />
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  )
}