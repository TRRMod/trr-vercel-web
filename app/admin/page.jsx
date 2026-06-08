'use client';
import { useEffect, useState } from 'react';
import Nav from '../../components/Nav';
import { supabase } from '../../lib/supabase';

export default function Admin(){
 const [pin,setPin]=useState(''); const [ok,setOk]=useState(false); const [items,setItems]=useState([]); const [msg,setMsg]=useState('');
 useEffect(()=>{ if(ok) load(); },[ok]);
 function login(){ setOk(pin === (process.env.NEXT_PUBLIC_ADMIN_PIN || '1234')); }
 async function load(){ if(!supabase){setMsg('ยังไม่ได้ตั้งค่า Supabase ENV');return;} const {data,error}=await supabase.from('builds').select('*').order('created_at',{ascending:false}); if(error)setMsg(error.message); else setItems(data||[]); }
 async function toggle(id,is_public){ const {error}=await supabase.from('builds').update({is_public:!is_public}).eq('id',id); if(error)setMsg(error.message); else load(); }
 async function remove(id){ if(!confirm('ลบ Build นี้?'))return; const {error}=await supabase.from('builds').delete().eq('id',id); if(error)setMsg(error.message); else load(); }
 if(!ok) return <main className="wrap"><Nav/><section className="hero"><div className="watermark">ADMIN</div><h1>Admin</h1><p>ใส่ PIN เพื่อจัดการข้อมูล</p></section><div className="card row"><input placeholder="Admin PIN" value={pin} onChange={e=>setPin(e.target.value)} /><button onClick={login}>เข้าสู่ระบบ</button></div></main>
 return <main className="wrap"><Nav/><section className="hero"><div className="watermark">ADMIN</div><h1>Admin Settings</h1><p>จัดการ Build เปิด/ปิดหน้า Customer และลบข้อมูล</p></section>{msg&&<p className="notice">{msg}</p>}<div className="card"><table className="table"><thead><tr><th>Build</th><th>EP</th><th>Price</th><th>Public</th><th>Action</th></tr></thead><tbody>{items.map(i=><tr key={i.id}><td>{i.build||i.title}</td><td>{i.ep}</td><td>฿{Number(i.public_price||i.total_price||0).toLocaleString('th-TH')}</td><td>{i.is_public?'Yes':'No'}</td><td><button onClick={()=>toggle(i.id,i.is_public)}>{i.is_public?'Hide':'Show'}</button> <button onClick={()=>remove(i.id)}>Delete</button></td></tr>)}</tbody></table></div></main>
}
