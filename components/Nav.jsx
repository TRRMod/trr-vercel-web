'use client';
import { useEffect, useState } from 'react';

export default function Nav(){
  const [theme,setTheme]=useState('light');
  useEffect(()=>{document.documentElement.dataset.theme=theme},[theme]);
  return <div className="nav">
    <a className="brand" href="/">TRR Keyboard Build</a>
    <div className="links">
      <a className="btn" href="/customer">Customer</a>
      <a className="btn" href="/tracker">Tracker</a>
      <a className="btn" href="/admin">Admin</a>
      <button onClick={()=>setTheme(theme==='light'?'dark':'light')}>{theme==='light'?'Dark':'Light'}</button>
    </div>
  </div>
}
