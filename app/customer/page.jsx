'use client';
import { useEffect, useMemo, useState } from 'react';
import Nav from '../../components/Nav';
import BuildCard from '../../components/BuildCard';
import { supabase } from '../../lib/supabase';

const fields=['build','pcb','plate','foam','stab','switch1','case_name','keycap'];

export default function Customer(){
  const [items,setItems]=useState([]); const [filters,setFilters]=useState({}); const [sort,setSort]=useState('az'); const [loading,setLoading]=useState(true);
  useEffect(()=>{load()},[]);
  async function load(){
    if(!supabase){setLoading(false);return;}
    const {data,error}=await supabase.from('builds').select('*').eq('is_public',true).order('created_at',{ascending:false});
    if(!error) setItems(data||[]); setLoading(false);
  }
  const options=useMemo(()=>Object.fromEntries(fields.map(f=>[f,[...new Set(items.map(i=>i[f]).filter(Boolean))].sort()])),[items]);
  const shown=useMemo(()=>{
    let arr=items.filter(i=>fields.every(f=>!filters[f] || i[f]===filters[f]));
    if(sort==='az') arr.sort((a,b)=>(a.build||'').localeCompare(b.build||''));
    if(sort==='priceHigh') arr.sort((a,b)=>Number(b.public_price||b.total_price||0)-Number(a.public_price||a.total_price||0));
    if(sort==='priceLow') arr.sort((a,b)=>Number(a.public_price||a.total_price||0)-Number(b.public_price||b.total_price||0));
    return arr;
  },[items,filters,sort]);
  return <main className="wrap"><Nav/><section className="hero"><div className="watermark">TRR</div><h1>TRR Showcase</h1><p>ค้นหา Build / PCB / Plate / Foam / Stab / Switch / Case / Keycap</p></section>
  <div className="card"><div className="row">{fields.map(f=><div className="field" key={f}><span className="label">{f}</span><select value={filters[f]||''} onChange={e=>setFilters({...filters,[f]:e.target.value})}><option value="">ทั้งหมด</option>{(options[f]||[]).map(v=><option key={v} value={v}>{v}</option>)}</select></div>)}<div className="field"><span className="label">Sort</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="az">Name A-Z</option><option value="priceHigh">Price High → Low</option><option value="priceLow">Price Low → High</option></select></div></div></div>
  {loading && <p className="notice">กำลังโหลดข้อมูล...</p>}{!supabase && <p className="notice">ยังไม่ได้ใส่ ENV Supabase ใน Vercel</p>}
  <div className="grid" style={{marginTop:16}}>{shown.map(b=><BuildCard key={b.id} build={b}/>)}</div></main>
}
