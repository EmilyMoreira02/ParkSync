export default function SectionHead({ idx, label, title, lead, dim, id }) {
  return (
    <header className="section__head" data-head>
      <span className="eyebrow">
        <span className="eyebrow__idx">{idx}</span>
        {label}
      </span>
      <h2 className="section__title" id={id}>{title}</h2>
      {lead && <p className="section__lead">{lead}</p>}
      <div className="dim" aria-hidden="true">
        <span className="dim__line" data-dim />
        <span>{dim}</span>
      </div>
    </header>
  )
}
