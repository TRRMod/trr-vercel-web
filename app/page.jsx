import Nav from '../components/Nav';
export default function Home(){
  return <main className="wrap"><Nav/><section className="hero"><div className="watermark">TRR</div><h1>TRR Keyboard Build</h1><p>Customer Showcase / Admin Settings / Build Tracker พร้อมใช้งานบน Vercel</p><div className="row"><a className="btn" href="/customer">เปิดหน้า Customer</a><a className="btn" href="/tracker">เปิด Tracker</a><a className="btn" href="/admin">เปิด Admin</a></div></section></main>
}
