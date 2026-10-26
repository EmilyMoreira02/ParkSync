import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { useAnimation, revealChildren } from '../lib/useAnimation'
import { FLOW_STEPS } from '../data/content'
import SectionHead from './SectionHead'

const EDGES = {
  'e-wroom-mqtt': 'M290 135 H395',
  'e-mqtt-orq': 'M565 135 H640',
  'e-cmd-in': 'M450 170 V265 H330 V218 H290',
  'e-cmd-out': 'M450 170 V265 H330 V313 H290',
  'e-cam-in-lpr': 'M290 242 H360 V410 H625 V380',
  'e-cam-out-lpr': 'M290 337 H360 V410 H625 V380',
  'e-lpr-orq': 'M625 300 V250 H700 V180',
  'e-webcam-face': 'M290 420 H376 V340 H395',
  'e-face-orq': 'M465 300 V230 H665 V180',
  'e-patio-park': 'M290 515 H785 V380',
  'e-park-orq': 'M785 300 V180',
  'e-orq-db': 'M855 135 H972',
  'e-orq-ws': 'M855 158 H892 V290 H968',
  'e-ws-painel': 'M1010 332 V385 H985 V430',
  'e-api-app': 'M855 172 H880 V572 H1120 V500',
}

const EDGE_LABELS = [
  [300, 127, 'presença'],
  [574, 127, 'evento'],
  [338, 258, 'captura'],
  [440, 403, 'foto · HTTP'],
  [300, 412, 'frames'],
  [420, 508, 'frames do pátio'],
  [884, 128, "SQL"],
  [900, 284, 'JSON'],
  [960, 566, 'REST /api'],
]

function Node({ x, y, w, h, title, sub, core, pins = 3 }) {
  return (
    <g className={`node${core ? ' node--core' : ''}`} data-node>
      <rect x={x} y={y} width={w} height={h} rx="3" />
      {Array.from({ length: pins }).map((_, i) => (
        <rect key={i} className="node-pin" x={x + ((i + 1) * w) / (pins + 1) - 4} y={y - 3} width="8" height="3" />
      ))}
      <text className="node-title" x={x + 14} y={y + h / 2 - 3}>{title}</text>
      <text className="node-sub" x={x + 14} y={y + h / 2 + 15}>{sub}</text>
    </g>
  )
}

function Zone({ x, w, label, sub }) {
  return (
    <g>
      <rect className="zone" x={x} y="44" width={w} height="550" rx="6" />
      <text className="zone-label" x={x + 16} y="70">{label}</text>
      <text className="zone-sub" x={x + 16} y="86">{sub}</text>
    </g>
  )
}

export default function Architecture() {
  const ref = useRef(null)
  const svgRef = useRef(null)
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [inView, setInView] = useState(false)
  const [reduced] = useState(prefersReducedMotion)
  const step = FLOW_STEPS[active]

  useAnimation(ref, (root) => {
    revealChildren(root)
    gsap.from(root.querySelectorAll('[data-dim]'), {
      scaleX: 0, duration: 1, ease: 'power2.out',
      scrollTrigger: { trigger: root, start: 'top 75%', once: true },
    })
    const st = { trigger: root.querySelector('.arch-svg'), start: 'top 80%', once: true }
    const edges = root.querySelectorAll('.edge')
    edges.forEach((p) => {
      const len = p.getTotalLength()
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
    })
    const tl = gsap.timeline({ scrollTrigger: st })
    tl.from(root.querySelectorAll('.zone'), { autoAlpha: 0, scale: 0.97, transformOrigin: '50% 50%', stagger: 0.12, duration: 0.6 })
      .from(root.querySelectorAll('[data-node]'), { autoAlpha: 0, y: 12, stagger: 0.04, duration: 0.45 }, 0.25)
      .to(edges, { strokeDashoffset: 0, stagger: 0.04, duration: 0.8, ease: 'power2.inOut' }, 0.6)
      .set(edges, { strokeDasharray: 'none' })
      .from(root.querySelectorAll('.edge-label'), { autoAlpha: 0, duration: 0.4, stagger: 0.03 }, 1.2)
  })

  // só reproduz a sequência com a seção visível
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 })
    if (svgRef.current) io.observe(svgRef.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reduced || !playing || !inView) return
    const t = setTimeout(() => setActive((a) => (a + 1) % FLOW_STEPS.length), 3400)
    return () => clearTimeout(t)
  }, [active, playing, inView, reduced])

  // pacotes de dados correndo pelas trilhas da etapa ativa
  useEffect(() => {
    if (reduced || !svgRef.current) return
    const packets = svgRef.current.querySelectorAll('.packet')
    const tweens = Array.from(packets).map((c, i) =>
      gsap.fromTo(
        c,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 1.1,
          delay: (i % 3) * 0.18,
          repeat: -1,
          repeatDelay: 0.35,
          ease: 'power1.inOut',
          motionPath: {
            path: `#${c.dataset.edge}`,
            align: `#${c.dataset.edge}`,
            alignOrigin: [0.5, 0.5],
            start: step.reverse ? 1 : 0,
            end: step.reverse ? 0 : 1,
          },
        },
      ),
    )
    return () => tweens.forEach((t) => t.kill())
  }, [active, reduced, step.reverse])

  const choose = (i) => {
    setActive(i)
    setPlaying(false)
  }

  return (
    <section className="section" id="arquitetura" ref={ref} aria-labelledby="arq-title">
      <div className="container">
        <SectionHead
          id="arq-title"
          idx="02"
          label="Arquitetura"
          title={<>Borda IoT que escuta, <em>backend</em> que decide.</>}
          lead="O hardware percebe o veículo e acorda o backend via MQTT. O orquestrador busca a placa e o rosto, faz o match duplo com IA e devolve o resultado em tempo real para a guarita."
          dim="DIAGRAMA DE BLOCOS"
        />

        <div className="arch">
          <figure className="arch__diagram panel crop" data-reveal style={{ margin: 0 }}>
            <div className="arch__scroll" tabIndex={0} aria-label="Diagrama da arquitetura, role para os lados em telas pequenas">
              <svg
                ref={svgRef}
                className={`arch-svg${reduced ? ' is-static' : ''}`}
                viewBox="0 0 1200 610"
                role="img"
                aria-labelledby="arch-title arch-desc"
              >
                <title id="arch-title">Arquitetura do ParkSync</title>
                <desc id="arch-desc">
                  ESP32-WROOM publica eventos no broker Mosquitto, que entrega ao orquestrador FastAPI. O orquestrador
                  acorda as ESP32-CAM de entrada e saída, cujas fotos vão ao serviço de LPR (YOLO e EasyOCR). A webcam da
                  guarita alimenta o serviço facial (dlib) e a webcam do pátio alimenta o serviço de vagas. O
                  orquestrador consulta o MySQL, envia JSON por WebSocket ao painel do porteiro e atende o app do
                  morador pela API REST.
                </desc>
                <Zone x={20} w={300} label="EDGE LAYER" sub="hardware & IoT" />
                <Zone x={370} w={510} label="INTELLIGENCE LAYER" sub="backend FastAPI" />
                <Zone x={910} w={280} label="PERSISTÊNCIA & UI" sub="dados e interfaces" />

                {Object.entries(EDGES).map(([id, d]) => (
                  <path key={id} id={id} d={d} className={`edge${step.edges.includes(id) ? ' is-active' : ''}`} />
                ))}
                {EDGE_LABELS.map(([x, y, t]) => (
                  <text key={t} className="edge-label" x={x} y={y}>{t}</text>
                ))}

                <Node x={40} y={100} w={250} h={70} title="ESP32-WROOM" sub="2× ultrassom · 2× servo" />
                <Node x={40} y={195} w={250} h={70} title="ESP32-CAM · ENTRADA" sub="acordada sob comando" />
                <Node x={40} y={290} w={250} h={70} title="ESP32-CAM · SAÍDA" sub="acordada sob comando" />
                <Node x={40} y={385} w={250} h={70} title="WEBCAM GUARITA" sub="rosto · entrada e saída" />
                <Node x={40} y={480} w={250} h={70} title="WEBCAM PÁTIO" sub="monitor de vagas" />

                <Node x={395} y={100} w={170} h={70} title="MOSQUITTO" sub="broker MQTT" pins={2} />
                <Node x={640} y={90} w={215} h={90} title="ORQUESTRADOR" sub="matriz de decisão" core pins={4} />
                <Node x={395} y={300} w={140} h={80} title="FACE" sub="dlib · 128-d" pins={2} />
                <Node x={555} y={300} w={140} h={80} title="LPR" sub="YOLO + EasyOCR" pins={2} />
                <Node x={715} y={300} w={140} h={80} title="PARKING" sub="vagas · LPR" pins={2} />

                <g className="node" data-node>
                  <path className="node-shape" d="M972 110 a68 14 0 0 1 136 0 v76 a68 14 0 0 1 -136 0 z" />
                  <path d="M972 110 a68 14 0 0 0 136 0" fill="none" stroke="var(--trace)" strokeWidth="1.2" />
                  <text className="node-title" x="1040" y="152" textAnchor="middle">MySQL</text>
                  <text className="node-sub" x="1040" y="170" textAnchor="middle">SQLAlchemy</text>
                </g>
                <g className="node" data-node>
                  <circle className="node-shape" cx="1010" cy="290" r="42" />
                  <circle cx="1010" cy="290" r="34" fill="none" stroke="var(--trace)" strokeDasharray="3 4" />
                  <text className="node-title" x="1010" y="288" textAnchor="middle">WS</text>
                  <text className="node-sub" x="1010" y="304" textAnchor="middle">portaria</text>
                </g>
                <Node x={925} y={430} w={120} h={70} title="PAINEL" sub="porteiro" pins={2} />
                <Node x={1060} y={430} w={120} h={70} title="APP" sub="morador · Expo" pins={2} />

                {!reduced &&
                  step.edges.map((id) => (
                    <circle key={`${active}-${id}`} className={`packet${step.reverse ? ' packet--back' : ''}`} r="4.5" data-edge={id} />
                  ))}
              </svg>
            </div>
            <p className="arch__hint" aria-hidden="true">← arraste para ver o diagrama inteiro →</p>
          </figure>

          <div className="arch__panel">
            <ol className="arch__steps" aria-label="Sequência de uma entrada">
              {FLOW_STEPS.map((s, i) => (
                <li key={s.title}>
                  <button className="step-btn" aria-pressed={i === active} onClick={() => choose(i)}>
                    <span className="step-btn__n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="step-btn__t">{s.title}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="arch__caption panel">
              <span className="arch__caption-k">
                Etapa {String(active + 1).padStart(2, '0')} / {String(FLOW_STEPS.length).padStart(2, '0')}
              </span>
              <p>
                <strong>{step.title}.</strong> {step.text}
              </p>
              {!reduced && (
                <button className="link-btn" onClick={() => setPlaying((p) => !p)}>
                  {playing ? 'Pausar sequência' : 'Reproduzir sequência'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
