import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';
import { rowToPublic,rowToMaterial,materialPayload,publicPayload,uniq } from '@/lib/mapping';

function hasServiceRole(){
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY.trim());
}

function json(data,status=200){
  return NextResponse.json(data,{status});
}

async function readBuilds(sb,{mode,id}){
  let q = sb.from('builds').select('*',{count:'exact'});
  if(id) q = q.eq('id',id).limit(1);
  if(mode === 'public') q = q.eq('is_public',true);

  const orderColumn = mode === 'materials' || mode === 'options' || mode === 'debug' ? 'created_at' : 'updated_at';
  const {data,error,count} = await q.order(orderColumn,{ascending:false});
  if(error) throw error;
  return {data:data||[],count};
}

export async function GET(req){
  try{
    const sb = getServerSupabase();
    const {searchParams} = new URL(req.url);
    const mode = searchParams.get('mode') || 'public';
    const id = searchParams.get('id');

    // Tracker/Admin must use service role because many Supabase projects keep RLS on.
    // Without service role Supabase can return [] even when the table has data.
    if((mode === 'materials' || mode === 'options' || mode === 'debug') && !hasServiceRole()){
      return json({
        rows:[],
        error:'Missing SUPABASE_SERVICE_ROLE_KEY on Vercel. Tracker/Admin need the service role key to read builds when RLS is enabled.',
        env:{
          hasUrl:Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
          hasAnon:Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
          hasServiceRole:false
        }
      },500);
    }

    const {data,count} = await readBuilds(sb,{mode,id});

    if(mode === 'debug'){
      return json({
        ok:true,
        table:'builds',
        count:count ?? data.length,
        sample:data.slice(0,3),
        env:{
          hasUrl:Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
          hasAnon:Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
          hasServiceRole:hasServiceRole()
        }
      });
    }

    if(mode === 'options'){
      const r=data||[];
      return json({
        Build:uniq(r.map(x=>x.build)),
        PCB:uniq(r.map(x=>x.pcb)),
        Plate:uniq(r.map(x=>x.plate)),
        Foam:uniq(r.map(x=>x.foam)),
        Stab:uniq(r.map(x=>x.stab)),
        Case:uniq(r.map(x=>x.case_name)),
        Switch:uniq([...r.map(x=>x.switch1),...r.map(x=>x.switch2),...r.map(x=>x.switch3)]),
        Keycap:uniq(r.map(x=>x.keycap)),
        EP:uniq(r.map(x=>x.ep)),
        AssemblyFee:uniq(r.map(x=>x.assembly_fee))
      });
    }

    let rows=(data||[]).map(mode==='materials'?rowToMaterial:rowToPublic);
    if(id) return json({row:rows[0]||null});
    return json({rows,count:count ?? rows.length});
  }catch(e){
    return json({rows:[],error:e.message},500);
  }
}

export async function POST(req){
  try{
    if(!hasServiceRole()) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY on Vercel. Write actions need service role key.');
    const sb=getServerSupabase();
    const body=await req.json();
    const mode=body.mode||'material';
    const payload=mode==='public'?publicPayload(body.data||{}):materialPayload(body.data||{},false);
    const {data,error}=await sb.from('builds').insert(payload).select('*').single();
    if(error) throw error;
    return json({success:true,row:data});
  }catch(e){return json({success:false,error:e.message},500)}
}

export async function PATCH(req){
  try{
    if(!hasServiceRole()) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY on Vercel. Write actions need service role key.');
    const sb=getServerSupabase();
    const body=await req.json();
    const {id,mode}=body;
    if(!id) throw new Error('Missing id');
    let payload;
    if(mode==='public') payload=publicPayload(body.data||{});
    else if(mode==='deletePublic') payload={is_public:false,status:'Draft',updated_at:new Date().toISOString()};
    else payload=materialPayload(body.data||{},true);
    const {error}=await sb.from('builds').update(payload).eq('id',id);
    if(error) throw error;
    return json({success:true});
  }catch(e){return json({success:false,error:e.message},500)}
}

export async function DELETE(req){
  try{
    if(!hasServiceRole()) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY on Vercel. Write actions need service role key.');
    const sb=getServerSupabase();
    const {searchParams}=new URL(req.url);
    const id=searchParams.get('id');
    if(!id) throw new Error('Missing id');
    const {error}=await sb.from('builds').delete().eq('id',id);
    if(error) throw error;
    return json({success:true});
  }catch(e){return json({success:false,error:e.message},500)}
}
