import Header from './components/Header'
import Hero from './components/Hero'
import Nosotros from './components/Nosotros'
import Servicios from './components/Servicios'
import Certificaciones from './components/Certificaciones'
import VisitaTecnica from './components/VisitaTecnica'
import PlanesFlota from './components/PlanesFlota'
import Galeria from './components/Galeria'
import ArriendoNaves from './components/ArriendoNaves'
import VentaEquipamiento from './components/VentaEquipamiento'
import Clientes from './components/Clientes'
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
        <Certificaciones />
        <VisitaTecnica />
        <PlanesFlota />
        <Galeria />
        <ArriendoNaves />
        <VentaEquipamiento />
        <Clientes />
        <Contacto />
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  )
}