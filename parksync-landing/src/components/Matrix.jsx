import { useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { useAnimation, revealChildren } from '../lib/useAnimation'
import { FACE_OPTIONS, PLATE_OPTIONS, SCENARIOS, resolveScenario } from '../data/content'
import SectionHead from './SectionHead'

function Gate({ open, tone }) {
  const color = tone === 'ok' ? 'var(--ok)' : tone === 'warn' ? 'var(--warn)' : 'var(--alert)'
  return (
    <svg className="verdict__gate" viewBox="0 0 92 56" aria-hidden="true">
      <rect x="6" y="20" width="12" height="32" rx="1" fill="var(--panel-solid)" stroke="var(--trace)" />
      <circle cx="12" cy="27" r="3" fill={color} />
      <g className={`gate-arm${open ? ' is-open' : ''}`}>
        <rect x="16" y="24" width="72" height="6" rx="1" fill="var(--panel-solid)" stroke="var(--trace)" />
        {[28, 44, 60, 76].map((x) => (
          <rect key={x} x={x} y="24" width="7" height="6" fill={color} opacity="0.85" />
        ))}
      </g>
      <line x1="0" y1="52.5" x2="92" y2="52.5" stroke="var(--line-strong)" />
    </svg>
  )
}

const Chip = ({ yes, children }) => (
  <span className={`chip ${yes ? 'chip--yes' : 'chip--no'}`}>
    <i aria-hidden="true">{yes ? '✓' : '✕'}</i>
    {children}
  </span>
)

export default function Matrix() {
  const ref = useRef(null)
  const [face, setFace] = useState('ok')
  const [plate, setPlate] = useState('morador')
  const result = resolveScenario(face, plate)
  const scen = SCENARIOS.find((s) => s.id === result.id)
  const open = scen.gate === 'open'

  useAnimation(ref, (root) => {
    revealChildren(root)
    gsap.from(root.querySelectorAll('[data-dim]'), {
      scaleX: 0, duration: 1, ease: 'power2.out',
      scrollTrigger: { trigger: root, start: 'top 75%', once: true },
    })
    gsap.fromTo(root.querySelectorAll('.scen__item'), { autoAlpha: 0, x: 40 }, {
      autoAlpha: 1, x: 0, stagger: 0.09, duration: 0.6, ease: 'power3.out', clearProps: 'opacity,visibility,transform',
      scrollTrigger: { trigger: root.querySelector('.scen'), start: 'top 80%', once: true },
    })
  })

  return (
    <section className="section" id="matriz" ref={ref} aria-labelledby="matriz-title">
      <div className="container">
        <SectionHead
          id="matriz-title"
          idx="03"
          label="Matriz de decisão"
          title={<>Cinco cenários, <em>uma resposta</em> por veículo.</>}
          lead="O orquestrador avalia cada chegada contra cinco cenários, sempre priorizando a biometria facial sobre a identificação veicular. Simule uma chegada e veja qual regra entra em ação."
          dim="TABELA VERDADE · PORTARIA"
        />

        <div className="sim">
          <form className="sim__controls panel crop" data-reveal onSubmit={(e) => e.preventDefault()} aria-label="Simulador de chegada">
            <fieldset>
              <legend>Webcam · rosto</legend>
              <div className="seg seg--2">
                {FACE_OPTIONS.map((o) => (
                  <label key={o.id} className="seg__opt">
                    <input type="radio" name="face" value={o.id} checked={face === o.id} onChange={() => setFace(o.id)} />
                    {o.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>ESP32-CAM · placa</legend>
              <div className="seg seg--4">
                {PLATE_OPTIONS.map((o) => (
                  <label key={o.id} className="seg__opt">
                    <input type="radio" name="plate" value={o.id} checked={plate === o.id} onChange={() => setPlate(o.id)} />
                    {o.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="verdict" aria-live="polite">
              <div className="verdict__row">
                <Gate open={open} tone={scen.tone} />
                <div>
                  <div className={`verdict__state tone-${scen.tone}`}>{open ? 'Cancela aberta' : 'Cancela travada'}</div>
                  <p className="verdict__title">
                    {scen.code} · {scen.title}
                  </p>
                </div>
              </div>
              <p className="verdict__note">{result.note || scen.action}</p>
            </div>
          </form>

          <ul className="scen has-match" aria-label="Cenários da matriz">
            {SCENARIOS.map((s) => (
              <li key={s.id} className={`scen__item${s.id === scen.id ? ' is-match' : ''}`} aria-current={s.id === scen.id ? 'true' : undefined}>
                <div className="scen__code">
                  {s.code}
                  <b className={`tone-${s.tone}`}>{s.gate === 'open' ? 'LIBERA' : 'TRAVA'}</b>
                </div>
                <div>
                  <h3 className="scen__title">{s.title}</h3>
                  <div className="scen__cond">
                    <Chip yes={s.face}>Rosto</Chip>
                    <Chip yes={s.gate === 'open' && s.id !== 'temporario'}>{s.plate}</Chip>
                  </div>
                </div>
                <p className="scen__action">{s.action}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
