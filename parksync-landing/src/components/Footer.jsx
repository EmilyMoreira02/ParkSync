import { REPO_URL } from '../data/content'
import { GitHubIcon } from './Icons'

const CELLS = [
  ['Projeto', <span key="l" className="stamp__logo"><b>PARK</b>SYNC</span>],
  ['Tipo', 'TCC · Técnico em Desenv. de Sistemas'],
  ['Data', 'JAN / 2026'],
  ['Revisão', '2.0'],
  ['Escopo', 'Acesso condominial + matriz de estacionamento IoT'],
  ['Licença', <a key="lic" href="https://creativecommons.org/licenses/by-nc/4.0/deed.pt-br" target="_blank" rel="noreferrer">CC BY-NC 4.0</a>],
  ['Repositório', <a key="repo" href={REPO_URL} target="_blank" rel="noreferrer">GhostDev-Creator/ParkSync</a>],
  ['Folha', '1 / 1'],
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__cta">
          <h2>
            Quer ver o <em>código</em> por trás da cancela?
          </h2>
          <a className="btn" href={REPO_URL} target="_blank" rel="noreferrer">
            <GitHubIcon /> Abrir no GitHub
          </a>
        </div>
        <div className="stamp" role="group" aria-label="Carimbo do projeto">
          {CELLS.map(([k, v]) => (
            <div className="stamp__cell" key={k}>
              <span className="stamp__k">{k}</span>
              <span className="stamp__v">{v}</span>
            </div>
          ))}
        </div>
        <div className="footer__legal">
          <span>© 2026 Equipe ParkSync. Distribuído sob a licença CC BY-NC 4.0.</span>
          <a href="#topo">Voltar ao topo ↑</a>
        </div>
      </div>
    </footer>
  )
}
