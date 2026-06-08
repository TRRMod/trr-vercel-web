'use client';
import { useState } from 'react';
import Nav from '../../components/Nav';
import { supabase } from '../../lib/supabase';

const blank={build:'',ep:'',pcb:'',plate:'',foam:'',stab:'',case_name:'',switch1:'',switch1_qty:'',switch2:'',switch2_qty:'',switch3:'',switch3_qty:'',keycap:'',assembly_fee:0,shipping_cost:0,shipping_price:0,total_cost:0,total_price:0,profit:0,description:'',cover_image:'',youtube_build_url:'',youtube_sound_url:'',is_public:true};
const inputs=['build','ep','pcb','plate','foam','stab','case_name','switch1','switch1_qty','switch2','switch2_qty','switch3','switch3_qty','keycap','assembly_fee','shipping_cost','shipping_price','total_cost','total_price','profit','cover_image','youtube_build_url','youtube_sound_url'];

export default function Tracker(){
 const [form,setForm]=useState(blank); const [msg,setMsg]=useState('');
 async function save(e){e.preventDefault(); setMsg(''); if(!supabase){setMsg('ยังไม่ได้ตั้งค่า Supabase ENV');return;}
  const payload={...form, switch1_qty:Number(form.switch1_qty||0), switch2_qty:Number(form.switch2_qty||0), switch3_qty:Number(form.switch3_qty||0), assembly_fee:Number(form.assembly_fee||0), shipping_cost:Number(form.shipping_cost||0), shipping_price:Number(form.shipping_price||0), total_cost:Number(form.total_cost||0), total_price:Number(form.total_price||0), profit:Number(form.profit||0)};
  const {error}=await supabase.from('builds').insert(payload); setMsg(error?error.message:'บันทึกสำเร็จ'); if(!error) setForm(blank);
 }
 return <main className="wrap"><Nav/><section className="hero"><div className="watermark">TRACKER</div><h1>Keyboard Build Tracker</h1><p>บันทึกข้อมูล Build และ Additional/Description ลง Supabase</p></section>
 <form className="card" onSubmit={save}><div className="row">{inputs.map(k=><div className="field" key={k}><span className="label">{k}</span><input value={form[k]??''} onChange={e=>setForm({...form,[k]:e.target.value})}/></div>)}<div className="field" style={{minWidth:'100%'}}><span className="label">Additional / Description</span><textarea rows="4" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div></div><div className="actions"><button>บันทึก Build</button></div>{msg&&<p className="notice">{msg}</p>}</form></main>
}
