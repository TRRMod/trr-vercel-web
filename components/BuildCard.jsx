export default function BuildCard({ build }){
  const img = build.cover_image || (Array.isArray(build.image_urls) ? build.image_urls[0] : null);
  const price = build.public_price || build.total_price || 0;
  return <div className="card">
    {img ? <img className="cover" src={img} alt={build.build || build.title || 'Build'} /> : <div className="cover" />}
    <h3>{build.title || build.build || 'Untitled Build'}</h3>
    <p className="muted">EP {build.ep || '-'} · {build.status || 'public'}</p>
    <div>
      {build.pcb && <span className="bright">PCB {build.pcb}</span>} {' '}
      {build.plate && <span className="bright">Plate {build.plate}</span>} {' '}
      {build.switch1 && <span className="bright">Switch {build.switch1}</span>}
    </div>
    <p><b>Case:</b> {build.case_name || '-'}</p>
    <p><b>Keycap:</b> {build.keycap || '-'}</p>
    <div className="price">฿{Number(price).toLocaleString('th-TH')}</div>
    <div className="actions">
      {build.youtube_build_url && <a className="btn" target="_blank" href={build.youtube_build_url}>Build Video</a>}
      {build.youtube_sound_url && <a className="btn" target="_blank" href={build.youtube_sound_url}>Sound Test</a>}
    </div>
  </div>
}
