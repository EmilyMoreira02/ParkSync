import { useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useAnimation, revealChildren } from '../lib/useAnimation'
import { MODULES } from '../data/content'
import { MODULE_ICONS } from './Icons'
import SectionHead from './SectionHead'

export default function Modules() {
  const ref = useRef(null)

  useAnimation(ref, (root) => {
    revealChildren(root)
    gsap.from(root.querySelectorAll('[data-dim]'), {
      scaleX: 0, duration: 1, ease: 'power2.out',
      scrollTrigger: { trigger: root, start: 'top 75%', once: true },
    })
    gsap.from(root.querySelectorAll('.mod'), {
      autoAlpha: 0, y: 30, stagger: { each: 0.08, grid: 'auto', from: 'start' }, duration: 0.6, ease: 'power3.out',
      scrollTrigger: { trigger: root.querySelector('.mods'), start: 'top 82%', once: true },
    })
  })

  return (
    <section className="section" id="modulos" ref={ref} aria-labelledby="mod-title">
      <div className="container">
        <SectionHead
          id="mod-title"
          idx="06"
          label="Módulos"
          title={<>Seis módulos, <em>um sistema</em>.</>}
          lead="Do firmware que gira o servo ao app no bolso do morador, cada parte do ParkSync tem uma responsabilidade clara e conversa com o backend por um protocolo definido."
          dim="LAYOUT DA PLACA"
        />
        <div className="board" data-reveal>
          <div className="board__holes" aria-hidden="true">
            <span /><span /><span /><span />
          </div>
          <p className="board__silk" aria-hidden="true">PARKSYNC-MAIN · REV 2.0 · 2026</p>
          <ul className="mods">
            {MODULES.map((m) => {
              const Icon = MODULE_ICONS[m.id]
              return (
                <li key={m.id}>
                  <article className="mod">
                    <span className="mod__pads" aria-hidden="true"><i /><i /><i /><i /></span>
                    <div className="mod__head">
                      <span className="mod__ref">{m.ref}</span>
                      <span className="mod__tag">{m.tag}</span>
                    </div>
                    <Icon className="mod__icon" />
                    <h3>{m.title}</h3>
                    <p>{m.text}</p>
                  </article>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
