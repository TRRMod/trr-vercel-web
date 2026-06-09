'use client';
import {useEffect,useMemo,useState} from 'react';
import {api,money} from '@/lib/api';
import {calcTotals} from '@/lib/mapping';

const priceParts=['PCB','Plate','Foam','Stab','Case','Switch1','Switch2','Switch3','Keycap'];
const empty={Build:'',EP:'',PCB:'',Plate:'',Foam:'',Stab:'',Case:'',Switch1:'',Switch2:'',Switch3:'',Keycap:'',Additional:'',Remark:'','ค่าประกอบ':'','ค่าส่งทุน':'','ค่าส่งจริง':'','Switch1_จำนวน':'','Switch2_จำนวน':'','Switch3_จำนวน':''};
const optionKeys=['Build','EP','PCB','Plate','Foam','Stab','Case','Switch','Keycap','AssemblyFee'];
const tableCols=[
  ['Build','build'],['EP','ep'],['PCB','pcb'],['Plate','plate'],['Foam','foam'],['Stab','stab'],['Case','case'],
  ['Switch1','switch1'],['Switch1_จำนวน','switch1_qty'],['Switch2','switch2'],['Switch2_จำนวน','switch2_qty'],['Switch3','switch3'],['Switch3_จำนวน','switch3_qty'],
  ['Keycap','keycap'],['ค่าประกอบ','assembly'],['ค่าส่งทุน','shipping_cost'],['รวมทุน','total_cost'],['รวมขาย','total_price'],['กำไร','profit']
];

function DatalistInput({id,value,onChange,options=[],type='text',className='',placeholder='',max}){
  return <><input type={type} list={type==='number'?undefined:`dl-${id}`} value={value||''} max={max} onChange={onChange} className={className} placeholder={placeholder}/>{type!=='number'&&<datalist id={`dl-${id}`}>{options.map(v=><option key={v} value={v}/>)}</datalist>}</>;
}
function coerceSort(v){const n=parseFloat(v); if(Number.isFinite(n)) return n; return String(v||'').toLowerCase();}
function passPin(pin){if(!pin) return true; if(typeof window==='undefined') return false; return sessionStorage.getItem('trr_tracker_pin_ok')==='1';}

export default function Tracker(){
  const requiredPin=process.env.NEXT_PUBLIC_ADMIN_PIN||'';
  const [unlocked,setUnlocked]=useState(()=>passPin(requiredPin));
  const [pin,setPin]=useState('');
  const [pinErr,setPinErr]=useState('');
  const [rows,setRows]=useState([]),[form,setForm]=useState(empty),[edit,setEdit]=useState(null),[busy,setBusy]=useState(false),[err,setErr]=useState('');
  const [options,setOptions]=useState(Object.fromEntries(optionKeys.map(k=>[k,[]])));
  const [sort,setSort]=useState({key:'',dir:'asc'});
  const [dark,setDark]=useState(false);

  useEffect(()=>{const saved=localStorage.getItem('trr_tracker_theme'); const isDark=saved?saved==='dark':false; setDark(isDark); document.body.classList.toggle('dark',isDark); document.body.classList.toggle('light',!isDark);},[]);
  useEffect(()=>{if(unlocked) load();},[unlocked]);
  const sum=useMemo(()=>calcTotals(form),[form]);
  const sortedRows=useMemo(()=>{const out=[...rows]; if(!sort.key) return out; out.sort((a,b)=>{const av=coerceSort(a[sort.key]); const bv=coerceSort(b[sort.key]); if(av<bv) return sort.dir==='asc'?-1:1; if(av>bv) return sort.dir==='asc'?1:-1; return 0;}); return out;},[rows,sort]);

  function unlock(e){e.preventDefault(); if(!requiredPin || pin===requiredPin){sessionStorage.setItem('trr_tracker_pin_ok','1'); setUnlocked(true); setPinErr('');} else setPinErr('รหัสผ่านไม่ถูกต้อง');}
  function toggleTheme(){const next=!dark; setDark(next); localStorage.setItem('trr_tracker_theme',next?'dark':'light'); document.body.classList.toggle('dark',next); document.body.classList.toggle('light',!next);}
  async function load(){setErr(''); try{const [r,o]=await Promise.all([api('/api/builds?mode=materials'),api('/api/builds?mode=options')]); setRows(r.rows||[]); setOptions({...Object.fromEntries(optionKeys.map(k=>[k,[]])),...o}); if((r.rows||[]).length===0) setErr('ไม่พบข้อมูลในตาราง builds');}catch(e){setRows([]); setErr(e.message||String(e));}}
  function set(k,v){setForm(f=>({...f,[k]:v}))}
  function clampNum(v){if(v==='') return ''; const n=Math.max(0,Math.min(99999,parseInt(v,10)||0)); return String(n);}
  async function save(){setBusy(true); setErr(''); try{if(edit) await api('/api/builds',{method:'PATCH',body:JSON.stringify({id:edit,data:form,mode:'material'})}); else await api('/api/builds',{method:'POST',body:JSON.stringify({data:form,mode:'material'})}); clear(); await load();}catch(e){setErr(e.message||String(e));}finally{setBusy(false)}}
  function clear(){setForm({...empty});setEdit(null)}
  async function del(id){if(confirm('ลบรายการนี้?')){await api('/api/builds?id='+id,{method:'DELETE'});load()}}
  function start(r){setEdit(r.ID);setForm({...empty,...r});scrollTo({top:0,behavior:'smooth'})}
  function sortBy(k){setSort(s=>s.key===k?{key:k,dir:s.dir==='asc'?'desc':'asc'}:{key:k,dir:'asc'});}
  const sortMark=k=>sort.key===k?(sort.dir==='asc'?' ▲':' ▼'):'';

  if(!unlocked){return <div className="tracker-lock"><form className="lock-card" onSubmit={unlock}><div className="lock-icon">⌨️</div><h1>Keyboard Build Tracker</h1><p>กรอกรหัสผ่านเพื่อเข้าใช้งานหน้า Tracker</p><input type="password" value={pin} onChange={e=>setPin(e.target.value)} placeholder="One password" autoFocus/><button className="btn btn-save">เข้าสู่ระบบ</button>{pinErr&&<div className="lock-error">{pinErr}</div>}</form></div>}

  return <div><div className="topbar"><span style={{fontSize:22}}>⌨️</span><span className="topbar-title">Keyboard Build Tracker</span><div className="topbar-nav"><button className="nav-pill theme-pill" onClick={toggleTheme}>🌓 {dark?'Dark':'Light'}</button><a className="nav-pill" href="/admin">Admin</a><a className="nav-pill" href="/customer" target="_blank">Customer</a></div></div><div className="main"><div className="card"><div className="card-title"><span className="dot"/> กรอกรายละเอียดวัตถุดิบ</div><div className="form-grid"><span className="section-label">ข้อมูล Build</span><div className="field"><label>Build</label><DatalistInput id="Build" value={form.Build} options={options.Build} onChange={e=>set('Build',e.target.value)}/></div><div className="field"><label>EP</label><DatalistInput id="EP" value={form.EP} options={options.EP} onChange={e=>set('EP',e.target.value)}/></div><hr className="form-divider"/><span className="section-label">วัตถุดิบ + ราคาทุน / ราคาขายจริง (฿)</span><div className="price-table-wrap"><table className="price-table material-price-table"><thead><tr><th>ชิ้นส่วน</th><th>วัตถุดิบ</th><th>ราคาทุน</th><th>ราคาขายจริง</th><th>จำนวน</th></tr></thead><tbody>{priceParts.map(p=>{const opt=p.startsWith('Switch')?options.Switch:options[p]||[];return <tr key={p}><td>{p}</td><td><DatalistInput id={p} value={form[p]} options={opt} onChange={e=>set(p,e.target.value)} className="material-input"/></td><td><input type="number" max="99999" value={form[`${p}_ทุน`]||''} onChange={e=>set(`${p}_ทุน`,clampNum(e.target.value))} className="price-input compact-number"/></td><td><input type="number" max="99999" value={form[`${p}_ขาย`]||''} onChange={e=>set(`${p}_ขาย`,clampNum(e.target.value))} className="price-input compact-number"/></td><td>{p.startsWith('Switch')?<input type="number" max="99999" value={form[`${p}_จำนวน`]||''} onChange={e=>set(`${p}_จำนวน`,clampNum(e.target.value))} className="qty-input compact-number"/>:'-'}</td></tr>})}</tbody></table></div><div className="field full"><label>Additional</label><input value={form.Additional||''} onChange={e=>set('Additional',e.target.value)} placeholder="รายละเอียดเพิ่มเติม เช่น สี / งานพิเศษ"/></div><hr className="form-divider"/><span className="section-label">ค่าใช้จ่ายอื่น</span><div className="field"><label>ค่าประกอบ</label><DatalistInput id="AssemblyFee" type="text" value={form['ค่าประกอบ']} options={options.AssemblyFee} onChange={e=>set('ค่าประกอบ',clampNum(e.target.value))} placeholder="เช่น 590"/></div><div className="field"><label>Remark</label><input value={form.Remark||''} onChange={e=>set('Remark',e.target.value)} placeholder="หมายเหตุเพิ่มเติม"/></div><div className="field"><label>ค่าส่งทุน</label><input type="number" max="99999" value={form['ค่าส่งทุน']||''} onChange={e=>set('ค่าส่งทุน',clampNum(e.target.value))}/></div><div className="field"><label>ค่าส่งจริง</label><input type="number" max="99999" value={form['ค่าส่งจริง']||''} onChange={e=>set('ค่าส่งจริง',clampNum(e.target.value))}/></div></div><div className="summary-row"><div className="sum-card"><div className="sum-label">รวมต้นทุน</div><div className="sum-value">{money(sum.total_cost)}</div></div><div className="sum-card"><div className="sum-label">รวมราคาขาย</div><div className="sum-value">{money(sum.total_price)}</div></div><div className={`sum-card ${sum.profit>=0?'profit':'loss'}`}><div className="sum-label">กำไร</div><div className="sum-value">{money(sum.profit)}</div></div></div><div className="btn-row"><button className="btn btn-clear" onClick={clear}>✕ Clear</button><button disabled={busy} className="btn btn-save" onClick={save}>💾 {edit?'อัปเดต':'บันทึก'}</button></div>{err&&<div className="empty" style={{marginTop:12,color:'#a32d2d'}}>{err}</div>}</div><div className="card"><div className="table-header-row"><div className="card-title" style={{margin:0}}><span className="dot"/> รายการวัตถุดิบที่บันทึกไว้</div><div style={{display:'flex',gap:10,alignItems:'center'}}><span className="table-count">{rows.length} รายการ</span><button className="btn btn-refresh" onClick={load}>🔄 Refresh</button></div></div><div className="table-wrap"><table className="data-table"><thead><tr><th onClick={()=>sortBy('__index')} className="sortable">#</th>{tableCols.map(([label,key])=><th key={key} onClick={()=>sortBy(label)} className="sortable">{label}{sortMark(label)}</th>)}<th>Action</th></tr></thead><tbody>{sortedRows.map((r,i)=><tr key={r.ID}><td>{i+1}</td>{tableCols.map(([label])=><td key={label} className={['ค่าประกอบ','ค่าส่งทุน','รวมทุน','รวมขาย','กำไร'].includes(label)?'money':''}>{r[label]||'-'}</td>)}<td><button className="btn-edit" onClick={()=>start(r)}>Edit</button><button className="btn-del" onClick={()=>del(r.ID)}>Delete</button></td></tr>)}</tbody></table></div></div></div></div>;
}
