import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

export const MOTION_OK = '(prefers-reduced-motion: no-preference)'

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export { gsap, ScrollTrigger }
