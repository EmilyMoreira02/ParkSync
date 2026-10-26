import { useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useAnimation } from '../lib/useAnimation'
import { STACK } from '../data/content'
import SectionHead from './SectionHead'

export default function Stack() {
  const ref = useRef(null)

  useAnimation(ref, (root) => {
    gsap.from(root.querySelectorAll('[data-head] > *'), {
      autoAlpha: 0, y: 24, stagger: 0.08, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: root, start: 'top 80%', once: true },
    })
    // chips "soldados" na placa: caem e as perninhas aparecem
    const chips = root.querySelectorAll('.ic')
    gsap.from(chips, {
      autoAlpha: 0, y: -26, scale: 0.94, stagger: 0.08, duration: 0.6, ease: 'back.out(1.6)',
      scrollTrigger: { trigger: root.querySelector('.chips'), start: 'top 82%', once: true },
    })
    gsap.from(root.querySelectorAll('.ic__pins i'), {
      scaleX: 0, transformOrigin: (i, el) => (el.parentElement.classList.contains('ic__pins--l') ? '100% 50%' : '0% 50%'),
      stagger: 0.008, duration: 0.25, delay: 0.5,
      scrollTrigger: { trigger: root.querySelector('.chips'), start: 'top 82%', once: true },
    })
  })

  return (
    <section className="section" id="stack" ref={ref} aria-labelledby="stack-title">
      <div className="container">
        <SectionHead
          id="stack-title"
          idx="05"
          label="Stack tecnológica"
          title={<>Cada camada, <em>um componente</em> na placa.</>}
          lead="Python e FastAPI no núcleo, MQTT entre o hardware e o servidor, visão computacional para rosto e placa, e interfaces web e mobile por cima."
          dim="BOM · LISTA DE COMPONENTES"
        />
        <ul className="chips" role="list">
          {STACK.map((s) => {
            const half = Math.ceil(s.pins / 2)
            return (
              <li key={s.part} className="ic">
                <span className="ic__pins ic__pins--l" aria-hidden="true">
                  {Array.from({ length: half }).map((_, i) => <i key={i} />)}
                </span>
                <span className="ic__pins ic__pins--r" aria-hidden="true">
                  {Array.from({ length: half }).map((_, i) => <i key={i} />)}
                </span>
                <div className="ic__body">
                  <span className="ic__notch" aria-hidden="true" />
                  <span className="ic__dot" aria-hidden="true" />
                  <div className="ic__part">
                    <span>{s.part}</span>
                    <span>{s.layer}</span>
                  </div>
                  <h3 className="ic__tech">{s.tech}</h3>
                  <p className="ic__role">{s.role}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
