import { useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useAnimation } from '../lib/useAnimation'
import { HERO_SPECS, REPO_URL } from '../data/content'
import { ArrowIcon, GitHubIcon } from './Icons'
import IsoArt from './IsoArt'

// Trilhas de PCB do fundo: [path, pads nas pontas?]
const TRACES = [
  'M0 170 H210 L250 210 H420',
  'M0 210 H170 L230 270 H330',
  'M0 660 H130 L190 600 H350 L390 560',
  'M0 700 H260 L300 740 H470',
  'M90 0 V80 L130 120 H270',
  'M1440 110 H1270 L1230 150 H1090',
  'M1440 150 H1300 L1250 200 H1180 V260',
  'M1440 780 H1310 L1260 730 H1120',
  'M1440 820 H1210 L1170 860 H1000 V900',
  'M620 900 V830 L660 790 H820',
  'M980 0 V50 L1020 90 H1160',
]

function Logo() {
  const split = (word, cls) =>
    word.split('').map((c, i) => (
      <span key={cls + i} className={`logo__char ${cls}`} aria-hidden="true">
        {c}
      </span>
    ))
  return (
    <h1 className="logo">
      <span className="visually-hidden">ParkSync</span>
      {split('PARK', 'logo__park')}
      {split('SYNC', 'logo__sync')}
    </h1>
  )
}

export default function Hero() {
  const ref = useRef(null)

  useAnimation(ref, (root) => {
    // trilhas desenhadas
    root.querySelectorAll('.trace').forEach((p) => {
      const len = p.getTotalLength()
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
    })
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.to('.trace', { strokeDashoffset: 0, duration: 1.6, stagger: 0.06, ease: 'power2.inOut' }, 0)
      .from('.pad, .via', { scale: 0, transformOrigin: '50% 50%', duration: 0.4, stagger: 0.02 }, 0.9)
      .from('.hero__doc span', { autoAlpha: 0, y: 10, stagger: 0.08, duration: 0.5 }, 0.1)
      .from('.logo__char', { yPercent: 110, autoAlpha: 0, rotateX: -70, stagger: 0.045, duration: 0.8 }, 0.2)
      .from('.hero__tagline', { autoAlpha: 0, x: -20, duration: 0.7 }, 0.7)
      .from('.hero__lead, .hero__actions', { autoAlpha: 0, y: 18, stagger: 0.1, duration: 0.7 }, 0.85)
      .from('[data-iso-layer]', { autoAlpha: 0, y: -60, stagger: 0.18, duration: 0.9, ease: 'back.out(1.4)' }, 0.4)
      .from('[data-iso-panel]', { autoAlpha: 0, x: 30, duration: 0.7 }, 0.9)
      .from('[data-iso-guides]', { autoAlpha: 0, duration: 0.6 }, 1.2)
      .from('[data-callout]', { autoAlpha: 0, x: (i) => (i % 2 ? -14 : 14), stagger: 0.12, duration: 0.6 }, 1.3)
      .from('.spec', { autoAlpha: 0, y: 20, stagger: 0.08, duration: 0.6 }, 1.1)

    // explosão das camadas conforme o hero sai da tela
    const ex = gsap.timeline({
      scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.6 },
    })
    ex.to('[data-iso-layer="2"]', { y: -70, ease: 'none' }, 0)
      .to('[data-iso-layer="1"]', { y: -28, ease: 'none' }, 0)
      .to('[data-iso-layer="0"]', { y: 22, ease: 'none' }, 0)
      .to('[data-iso-guides]', { scaleY: 1.25, transformOrigin: '50% 100%', ease: 'none' }, 0)
  })

  return (
    <section className="hero" id="topo" ref={ref} aria-labelledby="hero-title">
      <svg className="hero__traces" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {TRACES.map((d, i) => (
          <path key={i} className={`trace${i % 3 === 0 ? ' trace--bright' : ''}`} d={d} />
        ))}
        {[[420, 210], [330, 270], [390, 560], [470, 740], [270, 120], [1090, 150], [1180, 260], [1120, 730], [1000, 900], [820, 790], [1160, 90]].map(
          ([x, y], i) => (
            <circle key={i} className="pad" cx={x} cy={y} r="5" />
          ),
        )}
        {[[250, 210], [190, 600], [1230, 150], [1260, 730], [660, 790]].map(([x, y], i) => (
          <circle key={i} className="via" cx={x} cy={y} r="2.5" />
        ))}
      </svg>

      <div className="container hero__grid">
        <div className="hero__copy">
          <div className="hero__doc" aria-hidden="true">
            <span>DOC PS-TCC</span>
            <span>REV 2.0</span>
            <span>ESC 1:1</span>
          </div>
          <div id="hero-title">
            <Logo />
          </div>
          <p className="hero__tagline">Acesso Condominial Autônomo &amp; Matriz de Estacionamento IoT</p>
          <p className="hero__lead">
            A cancela só abre quando o rosto do morador e a placa do veículo dele batem. Visitas agendadas e veículos
            temporários seguem regras próprias, o pátio é vigiado por câmera e cada decisão fica registrada.
          </p>
          <div className="hero__actions">
            <a className="btn" href="#arquitetura">
              Ver arquitetura <ArrowIcon />
            </a>
            <a className="btn btn--ghost" href={REPO_URL} target="_blank" rel="noreferrer">
              <GitHubIcon /> Código no GitHub
            </a>
          </div>
        </div>
        <div className="hero__art">
          <IsoArt />
        </div>
      </div>

      <div className="container">
        <dl className="specs crop">
          {HERO_SPECS.map((s) => (
            <div className="spec" key={s.unit}>
              <dt className="visually-hidden">{s.unit}</dt>
              <dd style={{ margin: 0 }}>
                <span className="spec__value">{s.value}</span>
                <span className="spec__unit">{s.unit}</span>
                <div className="spec__label">{s.label}</div>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
