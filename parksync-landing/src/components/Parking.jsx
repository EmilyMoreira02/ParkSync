import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useAnimation, revealChildren } from '../lib/useAnimation'
import { PARKING_STEPS } from '../data/content'
import SectionHead from './SectionHead'

const BAYS = 6
const BAY_W = 80
const BAY_X0 = 40
const bayCenter = (n) => BAY_X0 + (n - 1) * BAY_W + BAY_W / 2

// Estado final de cada vaga (o que a versão estática mostra)
const FINAL = {
  1: { text: 'OCUPADA · OK', tone: 'ok' },
  3: { text: 'OCUPADA · OK', tone: 'ok' },
  5: { text: 'CONFLITO', tone: 'alert' },
}

function Car({ id, plate }) {
  return (
    <g data-car={id}>
      <rect className="car-body" x="-32" y="-17" width="64" height="34" rx="9" />
      <rect className="car-glass" x="2" y="-13" width="14" height="26" rx="3" />
      <rect className="car-glass" x="-22" y="-12" width="10" height="24" rx="3" />
      <rect className="car-plate" x="-34" y="-7" width="4" height="14" rx="0.5" />
      <title>{plate}</title>
    </g>
  )
}

export default function Parking() {
  const ref = useRef(null)

  // posição final dos carros (também é o estado estático com reduced-motion)
  useLayoutEffect(() => {
    const root = ref.current
    const place = (sel, n) => gsap.set(root.querySelector(sel), { x: bayCenter(n), y: 118, rotation: -90, transformOrigin: '50% 50%' })
    place('[data-car="fixo"]', 1)
    place('[data-car="a"]', 3)
    place('[data-car="b"]', 5)
  }, [])

  useAnimation(ref, (root) => {
    revealChildren(root)
    gsap.from(root.querySelectorAll('[data-dim]'), {
      scaleX: 0, duration: 1, ease: 'power2.out',
      scrollTrigger: { trigger: root, start: 'top 75%', once: true },
    })
    gsap.from(root.querySelectorAll('.lot__step'), {
      autoAlpha: 0, x: 24, stagger: 0.12, duration: 0.6, ease: 'power3.out',
      scrollTrigger: { trigger: root.querySelector('.lot__steps'), start: 'top 80%', once: true },
    })

    const q = (s) => root.querySelector(s)
    const qa = (s) => root.querySelectorAll(s)
    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 1.6,
      paused: true,
      defaults: { ease: 'power2.inOut' },
    })

    // reinicia o pátio
    tl.set(qa('[data-final="3"], [data-final="5"], [data-read]'), { autoAlpha: 0 })
      .set(qa('[data-free="3"], [data-free="5"]'), { autoAlpha: 1 })
      .set(qa('[data-scan]'), { autoAlpha: 0 })
      .set(qa('[data-poly="3"], [data-poly="5"]'), { fill: 'rgba(53,85,255,0.06)' })

    const park = (n, carSel, label) => {
      const cx = bayCenter(n)
      tl.fromTo(
        q(carSel),
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 2.2,
          motionPath: {
            path: `M-60,292 H${cx - 54} Q${cx},292 ${cx},238 V118`,
            autoRotate: true,
          },
        },
      )
        .fromTo(q(`[data-scan="${n}"]`), { autoAlpha: 1, y: 0 }, { y: 150, duration: 0.9, ease: 'none' })
        .set(q(`[data-scan="${n}"]`), { autoAlpha: 0 })
        .to(q(`[data-poly="${n}"]`), { fill: n === 5 ? 'rgba(255,92,116,0.16)' : 'rgba(63,220,154,0.12)', duration: 0.3 })
        .to(qa(`[data-read="${n}"]`), { autoAlpha: 1, duration: 0.3, stagger: 0.15 })
        .set(q(`[data-free="${n}"]`), { autoAlpha: 0 })
        .to(q(`[data-final="${n}"]`), { autoAlpha: 1, duration: 0.3 }, label)
    }
    park(3, '[data-car="a"]', '+=0.1')
    tl.to({}, { duration: 0.6 })
    park(5, '[data-car="b"]', '+=0.1')
    tl.to({}, { duration: 2.4 })

    gsap.timeline({
      scrollTrigger: {
        trigger: q('.lot__view'),
        start: 'top 85%',
        end: 'bottom 10%',
        onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      },
    })
    return () => tl.kill()
  })

  return (
    <section className="section" id="vagas" ref={ref} aria-labelledby="vagas-title">
      <div className="container">
        <SectionHead
          id="vagas-title"
          idx="04"
          label="Parking detection"
          title={<>O pátio também <em>tem portaria</em>.</>}
          lead="Uma câmera apontada para as vagas vigia o estacionamento interno. Quando uma vaga muda de estado, o sistema lê a placa e confere se o carro pertence ao apartamento dono daquela vaga."
          dim="PLANTA · PÁTIO INTERNO"
        />

        <div className="lot">
          <figure className="lot__view panel crop" data-reveal style={{ margin: 0 }}>
            <svg viewBox="0 0 560 340" role="img" aria-labelledby="lot-title lot-desc">
              <title id="lot-title">Mapa de vagas com leitura de placa</title>
              <desc id="lot-desc">
                Seis vagas numeradas. Vagas 1 e 3 ocupadas por veículos dos moradores certos; a vaga 5 está ocupada por
                um veículo cuja placa não pertence ao apartamento 5 e aparece como conflito.
              </desc>
              <line x1="20" y1="240" x2="540" y2="240" stroke="var(--line-strong)" strokeDasharray="10 8" />
              <text className="lot-apto" x="24" y="330">VIA DE CIRCULAÇÃO →</text>
              {Array.from({ length: BAYS }).map((_, i) => {
                const n = i + 1
                const x = BAY_X0 + i * BAY_W
                const final = FINAL[n]
                return (
                  <g key={n}>
                    <rect className="lot-bay" x={x} y="40" width={BAY_W} height="150" />
                    <polygon
                      className="lot-poly"
                      data-poly={n}
                      points={`${x + 8},48 ${x + BAY_W - 8},48 ${x + BAY_W - 6},182 ${x + 6},182`}
                      style={final ? { fill: final.tone === 'alert' ? 'rgba(255,92,116,0.16)' : 'rgba(63,220,154,0.12)' } : undefined}
                    />
                    <text className="lot-num" x={x + 8} y="34">{String(n).padStart(2, '0')}</text>
                    <text className="lot-apto" x={x + BAY_W - 8} y="34" textAnchor="end">AP {String(n).padStart(2, '0')}</text>
                    <rect data-scan={n} className="scan-line" x={x + 4} y="44" width={BAY_W - 8} height="1" opacity="0" />
                    {final ? (
                      <>
                        <text data-free={n} className="lot-status" x={x + BAY_W / 2} y="212" textAnchor="middle" fill="var(--muted)" opacity="0">LIVRE</text>
                        <text data-final={n} className={`lot-status tone-${final.tone}`} x={x + BAY_W / 2} y="212" textAnchor="middle" fill="currentColor">
                          {final.text.split(' · ')[0]}
                        </text>
                      </>
                    ) : (
                      <text className="lot-status" x={x + BAY_W / 2} y="212" textAnchor="middle" fill="var(--muted)">LIVRE</text>
                    )}
                  </g>
                )
              })}

              <Car id="fixo" plate="Placa do apartamento 1" />
              <Car id="a" plate="RIO2A19, placa do apartamento 3" />
              <Car id="b" plate="QWE7J88, placa sem vínculo com o apartamento 5" />

              {/* leituras de placa */}
              <g data-read="3">
                <rect className="bbox" x={bayCenter(3) - 10} y="146" width="20" height="10" />
                <text className="bbox-label" x={bayCenter(3)} y="178" textAnchor="middle">RIO2A19 ✓</text>
              </g>
              <g data-read="5">
                <rect className="bbox bbox--alert" x={bayCenter(5) - 10} y="146" width="20" height="10" />
                <text className="bbox-label bbox-label--alert" x={bayCenter(5)} y="178" textAnchor="middle">QWE7J88 ✕</text>
              </g>
              <g data-read="5">
                <rect x="336" y="252" width="196" height="40" rx="3" fill="rgba(255,92,116,0.1)" stroke="var(--alert)" />
                <text className="bbox-label bbox-label--alert" x="346" y="268">ALERTA · VAGA 05</text>
                <text className="lot-apto" x="346" y="283" fill="var(--ink-dim)">placa não pertence ao AP 05</text>
              </g>
            </svg>
            <div className="lot__legend" aria-hidden="true">
              <span style={{ color: 'var(--muted)' }}>livre</span>
              <span style={{ color: 'var(--ok)' }}>ocupada pelo morador</span>
              <span style={{ color: 'var(--alert)' }}>conflito</span>
            </div>
          </figure>

          <ol className="lot__steps">
            {PARKING_STEPS.map((s) => (
              <li key={s.code} className="lot__step">
                <span className="lot__step-n">{s.code}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
