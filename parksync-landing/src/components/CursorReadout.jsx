import { useEffect, useRef } from 'react'

// Leitura de coordenadas estilo CAD no canto da tela (só com mouse).
export default function CursorReadout() {
  const ref = useRef(null)
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return
    let raf = 0
    const onMove = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (ref.current) {
          const x = String(Math.round(e.clientX)).padStart(4, '0')
          const y = String(Math.round(e.clientY + window.scrollY)).padStart(5, '0')
          ref.current.textContent = `X ${x} · Y ${y} mm`
        }
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])
  return <div className="cursor-readout" ref={ref} aria-hidden="true">X 0000 · Y 00000 mm</div>
}
