// Ilustração isométrica em camadas (releitura vetorial do banner do ParkSync).
const S = 24
const CX = 350
const CY = 300

function iso(x, y, z) {
  return [CX + (x - y) * S * 0.866, CY + (x + y) * S * 0.5 - z * S]
}
const pts = (list) => list.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ')

function Box({ x, y, z, w, d, h, strong, children }) {
  const top = [iso(x, y, z + h), iso(x + w, y, z + h), iso(x + w, y + d, z + h), iso(x, y + d, z + h)]
  const left = [iso(x, y + d, z), iso(x + w, y + d, z), iso(x + w, y + d, z + h), iso(x, y + d, z + h)]
  const right = [iso(x + w, y, z), iso(x + w, y + d, z), iso(x + w, y + d, z + h), iso(x + w, y, z + h)]
  return (
    <g className={strong ? 'iso-strong' : undefined}>
      <polygon className="iso-face iso-left" points={pts(left)} />
      <polygon className="iso-face iso-right" points={pts(right)} />
      <polygon className="iso-face iso-top" points={pts(top)} />
      {children}
    </g>
  )
}

const Line = ({ a, b, className = 'iso-detail' }) => {
  const [x1, y1] = iso(...a)
  const [x2, y2] = iso(...b)
  return <line className={className} x1={x1} y1={y1} x2={x2} y2={y2} />
}

function Car({ x, y, z }) {
  return (
    <g>
      <Box x={x} y={y} z={z} w={1.3} d={2.3} h={0.45} strong />
      <Box x={x + 0.15} y={y + 0.5} z={z + 0.45} w={1.0} d={1.2} h={0.38} />
    </g>
  )
}

function Callout({ from, to, label, sub, anchor = 'start' }) {
  const [fx, fy] = from
  const [tx, ty] = to
  const elbowX = anchor === 'start' ? tx - 12 : tx + 12
  return (
    <g className="callout" data-callout>
      <polyline className="callout-line" points={`${fx},${fy} ${elbowX},${ty} ${tx},${ty}`} />
      <circle className="callout-dot" cx={fx} cy={fy} r="3" />
      <text className="callout-text" x={anchor === 'start' ? tx + 6 : tx - 6} y={ty + 4} textAnchor={anchor}>{label}</text>
      <text className="callout-sub" x={anchor === 'start' ? tx + 6 : tx - 6} y={ty + 19} textAnchor={anchor}>{sub}</text>
    </g>
  )
}

export default function IsoArt() {
  const stripes = [2, 4, 6, 8]
  const dbTop = iso(6.5, 3.5, 10)
  const gw = iso(4, 6.2, 4.3)
  const car = iso(2.4, 9.6, 0.6)
  const panel = iso(11.2, 6, 2.6)
  return (
    <svg viewBox="0 0 720 600" role="img" aria-labelledby="iso-title iso-desc">
      <title id="iso-title">Camadas do ParkSync</title>
      <desc id="iso-desc">
        Ilustração isométrica em três camadas: pátio com veículos e sensores na base, gateway IoT no meio e banco de
        dados no topo, com um painel de controle ao lado.
      </desc>

      {/* guias verticais entre camadas */}
      <g data-iso-guides>
        {[[0.5, 0.5], [9.5, 0.5], [9.5, 9.5], [0.5, 9.5]].map(([x, y]) => (
          <Line key={`${x}-${y}`} a={[x, y, 0.3]} b={[x, y, 7]} className="iso-dash" />
        ))}
        <Line a={[5, 5, 4.5]} b={[5, 5, 7]} className="iso-dash" />
      </g>

      {/* camada 0: pátio */}
      <g data-iso-layer="0">
        <Box x={0} y={0} z={0} w={10} d={10} h={0.3} />
        {stripes.map((sx) => (
          <Line key={sx} a={[sx, 6.2, 0.3]} b={[sx, 10, 0.3]} />
        ))}
        <Line a={[0, 6.2, 0.3]} b={[10, 6.2, 0.3]} />
        <Line a={[0.6, 0.6, 0.3]} b={[5, 0.6, 0.3]} />
        <Box x={1} y={1.4} z={0.3} w={2.2} d={1.4} h={0.45} />
        <Box x={7.2} y={1.2} z={0.3} w={1.6} d={1.1} h={0.4} />
        <Car x={2.35} y={7.1} z={0.3} />
        <Car x={6.35} y={7.2} z={0.3} />
        <Box x={8.6} y={4} z={0.3} w={0.35} d={0.35} h={1.4} />
        <Line a={[8.78, 4.18, 1.6]} b={[8.78, 0.6, 1.6]} className="iso-detail" />
      </g>

      {/* painel de controle */}
      <g data-iso-panel>
        <polygon
          className="iso-face iso-right"
          points={pts([iso(11.2, 4.4, 0.6), iso(11.2, 8.8, 0.6), iso(11.2, 8.8, 4.4), iso(11.2, 4.4, 4.4)])}
        />
        <polygon
          className="iso-detail"
          points={pts([iso(11.2, 4.8, 1), iso(11.2, 8.4, 1), iso(11.2, 8.4, 4), iso(11.2, 4.8, 4)])}
        />
        <polygon
          className="iso-face iso-top"
          points={pts([iso(11.2, 5.2, 2.6), iso(11.2, 6.6, 2.6), iso(11.2, 6.6, 3.7), iso(11.2, 5.2, 3.7)])}
        />
        <Line a={[11.2, 5.2, 1.6]} b={[11.2, 8, 1.6]} />
        <Line a={[11.2, 5.2, 2.0]} b={[11.2, 7.2, 2.0]} />
        <Line a={[11.2, 7, 3.6]} b={[11.2, 8, 3.6]} />
        <Line a={[11.2, 7, 3.2]} b={[11.2, 8, 3.2]} />
      </g>

      {/* camada 1: gateway IoT */}
      <g data-iso-layer="1">
        <Box x={1.2} y={1.2} z={3.6} w={7.6} d={7.6} h={0.25} />
        <Line a={[1.8, 5, 3.85]} b={[4, 5, 3.85]} />
        <Line a={[6.2, 5, 3.85]} b={[8.2, 5, 3.85]} />
        <Line a={[5, 1.8, 3.85]} b={[5, 4, 3.85]} />
        <Line a={[5, 6.2, 3.85]} b={[5, 8.2, 3.85]} />
        <Box x={4} y={4} z={3.85} w={2.2} d={2.2} h={0.4} strong>
          <circle className="iso-led iso-led--ok" cx={iso(6.2, 5.6, 4.05)[0]} cy={iso(6.2, 5.6, 4.05)[1]} r="1.8" />
        </Box>
        <Line a={[4.6, 4.6, 4.25]} b={[4.6, 4.6, 5.6]} className="iso-detail" />
      </g>

      {/* camada 2: banco de dados */}
      <g data-iso-layer="2">
        <Box x={0.4} y={0.4} z={7} w={9.2} d={9.2} h={0.25} />
        {[0, 1, 2].map((i) => (
          <Box key={i} x={3.5} y={3.5} z={7.25 + i * 0.95} w={3} h={0.85} d={3} strong={i === 2}>
            <circle className="iso-led" cx={iso(6.5, 4.2, 7.65 + i * 0.95)[0]} cy={iso(6.5, 4.2, 7.65 + i * 0.95)[1]} r="1.6" />
            <circle className="iso-led" cx={iso(6.5, 4.7, 7.65 + i * 0.95)[0]} cy={iso(6.5, 4.7, 7.65 + i * 0.95)[1]} r="1.6" />
          </Box>
        ))}
      </g>

      <Callout from={dbTop} to={[548, 62]} label="BANCO DE DADOS" sub="MySQL · SQLAlchemy" />
      <Callout from={gw} to={[150, 228]} label="GATEWAY IoT" sub="MQTT · ESP32-WROOM" anchor="end" />
      <Callout from={car} to={[150, 520]} label="NÓS DE VEÍCULOS" sub="ultrassom · ESP32-CAM" anchor="end" />
      <Callout from={panel} to={[560, 470]} label="INTERFACE" sub="painel · app do morador" />
    </svg>
  )
}
