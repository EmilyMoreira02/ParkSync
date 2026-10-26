import { useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useAnimation, revealChildren } from '../lib/useAnimation'
import { PROBLEMS, SOLUTIONS } from '../data/content'
import SectionHead from './SectionHead'

export default function Vision() {
  const ref = useRef(null)

  useAnimation(ref, (root) => {
    revealChildren(root)
    gsap.from(root.querySelectorAll('[data-dim]'), {
      scaleX: 0, duration: 1, ease: 'power2.out',
      scrollTrigger: { trigger: root, start: 'top 75%', once: true },
    })
    const st = { trigger: root.querySelector('.compare'), start: 'top 75%', once: true }
    gsap.from(root.querySelectorAll('.compare__col--before .card'), { x: -30, autoAlpha: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out', scrollTrigger: st })
    gsap.from(root.querySelectorAll('.compare__col--after .card'), { x: 30, autoAlpha: 0, stagger: 0.12, delay: 0.35, duration: 0.7, ease: 'power3.out', scrollTrigger: st })
    root.querySelectorAll('.compare__bus path').forEach((p) => {
      const len = p.getTotalLength()
      gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1, delay: 0.3, ease: 'power2.inOut', scrollTrigger: st })
    })
  })

  return (
    <section className="section" id="visao" ref={ref} aria-labelledby="visao-title">
      <div className="container">
        <SectionHead
          id="visao-title"
          idx="01"
          label="Visão"
          title={<>A segurança condominial, <em>redefinida</em>.</>}
          lead="Portarias analógicas confiam em objetos e na atenção de uma pessoa. O ParkSync troca isso por uma decisão automática baseada em quem está ao volante e em qual carro ele dirige, processada entre a borda IoT e um backend com IA."
          dim="ESCOPO DO PROJETO"
        />

        <blockquote className="quote crop" data-reveal>
          Sem cancela manual, sem totem de ticket: uma <strong>matriz de decisão biométrica</strong> que cruza rosto e
          placa, registra cada acesso e avisa a portaria em tempo real.
          <footer>Desenvolvido como requisito para o título de Técnico em Desenvolvimento de Sistemas.</footer>
        </blockquote>

        <div className="compare">
          <div className="compare__col compare__col--before">
            <h3>Antes · portaria analógica</h3>
            <ul className="compare__list">
              {PROBLEMS.map((p) => (
                <li key={p.code} className="card panel">
                  <span className="card__code">{p.code}</span>
                  <h4>{p.title}</h4>
                  <p>{p.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="compare__bus" aria-hidden="true">
            <svg viewBox="0 0 72 400" preserveAspectRatio="none">
              {[70, 200, 330].map((y) => (
                <g key={y}>
                  <path d={`M0 ${y} H24 L36 ${y - 12} H48 L60 ${y} H72`} fill="none" stroke="var(--trace)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
                </g>
              ))}
            </svg>
          </div>
          <div className="compare__col compare__col--after">
            <h3>Depois · ParkSync</h3>
            <ul className="compare__list">
              {SOLUTIONS.map((p) => (
                <li key={p.code} className="card panel">
                  <span className="card__code">{p.code}</span>
                  <h4>{p.title}</h4>
                  <p>{p.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
