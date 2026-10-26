// Ícones em traço único, desenhados no estilo das trilhas (sem biblioteca externa).
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

export const GitHubIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...p}>
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
)

export const ArrowIcon = (p) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)

export const ServerIcon = (p) => (
  <svg {...base} {...p}><rect x="3" y="3" width="18" height="7" rx="1" /><rect x="3" y="14" width="18" height="7" rx="1" /><path d="M7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6" /></svg>
)
export const MonitorIcon = (p) => (
  <svg {...base} {...p}><rect x="2.5" y="3.5" width="19" height="13" rx="1" /><path d="M8 21h8M12 16.5V21M6 8h5M6 11h8M15 8h3v4h-3z" /></svg>
)
export const FormIcon = (p) => (
  <svg {...base} {...p}><rect x="4" y="2.5" width="16" height="19" rx="1" /><circle cx="12" cy="8.5" r="2.5" /><path d="M8 15h8M8 18h5" /></svg>
)
export const GridIcon = (p) => (
  <svg {...base} {...p}><path d="M3 4h18M3 20h18M7 4v6M12 4v6M17 4v6M7 14v6M12 14v6M17 14v6" /><rect x="8.5" y="5.5" width="2" height="3" /></svg>
)
export const PhoneIcon = (p) => (
  <svg {...base} {...p}><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M10.5 18.5h3M9 6h6M9 9h6M9 12h3" /></svg>
)
export const ChipIcon = (p) => (
  <svg {...base} {...p}><rect x="6" y="6" width="12" height="12" rx="1" /><rect x="9.5" y="9.5" width="5" height="5" /><path d="M9 2v4M12 2v4M15 2v4M9 18v4M12 18v4M15 18v4M2 9h4M2 12h4M2 15h4M18 9h4M18 12h4M18 15h4" /></svg>
)

export const MODULE_ICONS = {
  backend: ServerIcon,
  porteiro: MonitorIcon,
  cadastro: FormIcon,
  vagas: GridIcon,
  app: PhoneIcon,
  firmware: ChipIcon,
}
