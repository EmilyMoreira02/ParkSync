import { useLayoutEffect } from 'react'
import { gsap, MOTION_OK } from './gsap'

// Roda `setup` só quando o usuário aceita animação. Com prefers-reduced-motion
// nada é escondido: o conteúdo já nasce visível no CSS e as animações são extras.
export function useAnimation(scopeRef, setup, deps = []) {
  useLayoutEffect(() => {
    if (!scopeRef.current) return
    const mm = gsap.matchMedia(scopeRef)
    mm.add(MOTION_OK, () => setup(scopeRef.current))
    return () => mm.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

// Entrada padrão de elementos marcados com [data-reveal] dentro de uma seção.
export function revealChildren(root, selector = '[data-reveal]') {
  root.querySelectorAll(selector).forEach((el) => {
    gsap.from(el, {
      y: 28,
      autoAlpha: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
  })
}
