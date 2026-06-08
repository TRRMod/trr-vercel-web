export async function api(path, options={}){const res=await fetch(path,{headers:{'Content-Type':'application/json'},...options}); const data=await res.json().catch(()=>({})); if(!res.ok) throw new Error(data.error||res.statusText); return data}
export const money=n=>'฿'+Number(parseFloat(n)||0).toLocaleString('th-TH');
