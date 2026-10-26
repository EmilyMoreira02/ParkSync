# ParkSync · Landing page

Landing page do ParkSync (TCC · Técnico em Desenvolvimento de Sistemas) feita com **React + Vite + GSAP**,
no estilo blueprint / placa de circuito.

## Como rodar

Requer Node.js 18 ou mais novo.

```bash
npm install
npm run dev       # servidor de desenvolvimento em http://localhost:5173
npm run build     # gera a versão de produção em dist/
npm run preview   # serve o dist/ localmente para conferir o build
```

O `vite.config.js` usa `base: './'`, então o conteúdo de `dist/` funciona em qualquer subpasta
(GitHub Pages, Netlify, Vercel ou um servidor estático qualquer).

## Estrutura

```
src/
  App.jsx                 monta as seções na ordem da página
  styles.css              tokens de cor, grade blueprint e estilos de todas as seções
  data/content.js         TODOS os textos (edite aqui para mudar conteúdo)
  lib/gsap.js             registro dos plugins (ScrollTrigger, MotionPath)
  lib/useAnimation.js     hook que só anima quando prefers-reduced-motion permite
  components/
    Nav.jsx               menu fixo, link ativo por seção, barra de progresso
    Hero.jsx + IsoArt.jsx logotipo, trilhas PCB e ilustração isométrica em camadas
    Vision.jsx            antes x depois (problema / solução)
    Architecture.jsx      diagrama de blocos em SVG com pacotes animados por etapa
    Matrix.jsx            simulador da matriz de decisão (5 cenários)
    Parking.jsx           planta do pátio com leitura de placa animada
    Stack.jsx             stack como chips (CI) na placa
    Modules.jsx           os seis módulos do sistema
    Team.jsx              autoria
    Footer.jsx            carimbo técnico, licença e link do repositório
```

## Decisões

- **Fundo azul-marinho escuro**: é o papel de blueprint clássico e faz as trilhas em azul ParkSync (`#3553ff`)
  brilharem; o off-white e o grafite do banner aparecem nos detalhes (placas dos carros, cobre dos pads).
- **Sem Mermaid em runtime**: o diagrama da arquitetura é um SVG próprio, animado com GSAP MotionPath.
- **Acessibilidade**: landmarks semânticos, link "pular para o conteúdo", foco visível, SVGs com `title`/`desc`,
  simulador com rádios nativos e resultado em `aria-live`. Com `prefers-reduced-motion: reduce` nenhuma animação
  roda e todo o conteúdo aparece no estado final.
- **Dependências**: só `react`, `react-dom` e `gsap`. Ícones são SVG inline.

## Licença

Conteúdo do projeto ParkSync distribuído sob CC BY-NC 4.0.
