import { useEffect, useRef, useState } from 'react'
import { NAV, REPO_URL } from '../data/content'
import { GitHubIcon } from './Icons'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const progressRef = useRef(null)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        setScrolled(y > 24)
        const max = document.documentElement.scrollHeight - window.innerHeight
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // destaca o link da seção visível
  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <nav className={`nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`} aria-label="Principal">
      <div className="container nav__inner">
        <a className="nav__brand" href="#topo" aria-label="ParkSync, voltar ao topo">
          <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M8 26V6h9a6 6 0 0 1 0 12H8" fill="none" stroke="var(--blue-logo)" strokeWidth="3.2" strokeLinejoin="round" />
            <circle cx="25" cy="25" r="2.6" fill="var(--copper)" />
          </svg>
          <span><b>PARK</b>SYNC</span>
        </a>
        <button
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="nav-links"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
        </button>
        <ul id="nav-links" className={`nav__links${open ? ' is-open' : ''}`}>
          {NAV.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                className={active === n.id ? 'is-active' : undefined}
                aria-current={active === n.id ? 'location' : undefined}
                onClick={() => setOpen(false)}
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <a className="btn btn--ghost btn--sm nav__cta" href={REPO_URL} target="_blank" rel="noreferrer">
          <GitHubIcon /> Repositório
        </a>
      </div>
      <span className="nav__progress" ref={progressRef} aria-hidden="true" />
    </nav>
  )
}
