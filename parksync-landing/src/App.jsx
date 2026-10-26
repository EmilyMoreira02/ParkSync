import Nav from './components/Nav'
import Hero from './components/Hero'
import Vision from './components/Vision'
import Architecture from './components/Architecture'
import Matrix from './components/Matrix'
import Parking from './components/Parking'
import Stack from './components/Stack'
import Modules from './components/Modules'
import Team from './components/Team'
import Footer from './components/Footer'
import CursorReadout from './components/CursorReadout'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Nav />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <Vision />
        <Architecture />
        <Matrix />
        <Parking />
        <Stack />
        <Modules />
        <Team />
      </main>
      <Footer />
      <CursorReadout />
    </>
  )
}
