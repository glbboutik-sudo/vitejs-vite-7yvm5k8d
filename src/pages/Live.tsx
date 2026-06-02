import { useState, useRef } from 'react'

const P = '#D94F45'

const streams = [
  {
    name: 'MusiqueStore', handle: '@musiquestore', emoji: '🎸',
    bg: 'linear-gradient(160deg,#1a0805,#2a0f08)',
    sub: '1 243 abonnés', following: false,
    item: { title: 'Guitare vintage 1969', price: 340, bids: 12, remSec: 5200, totalSec: 7680 },
    chat: [
      { user: 'Sophie', text: 'Super guitare !', color: '#D94F45' },
      { user: 'Lucas',  text: 'Enchère : 350€',  color: '#F5A49F', bid: true },
      { user: 'Marie',  text: 'Magnifique !',    color: '#7c3aed' },
    ]
  },
  {
    name: 'LeatherCo', handle: '@leatherco', emoji: '👜',
    bg: 'linear-gradient(160deg,#0a1505,#122008)',
    sub: '532 abonnés', following: true,
    item: { title: 'Sac cuir artisanal', price: 180, bids: 7, remSec: 1200, totalSec: 2580 },
    chat: [
      { user: 'Thomas', text: 'Beau travail !', color: '#0891b2' },
      { user: 'Sophie', text: 'Enchère : 190€', color: '#D94F45', bid: true },
    ]
  },
  {
    name: 'PhotoPro', handle: '@photopro_fr', emoji: '📷',
    bg: 'linear-gradient(160deg,#05080f,#0a1020)',
    sub: '312 abonnés', following: false,
    item: { title: 'Leica M6', price: 890, bids: 23, remSec: 8400, totalSec: 19800 },
    chat: [
      { user: 'Marie', text: 'Enchère : 900€', color: '#7c3aed', bid: true },
      { user: 'Paul',  text: 'Vrai Leica ?',   color: '#e6732a' },
    ]
  },
]

function fmt(s: number) {
  if (s <= 0) return 'Fin'
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m`
  return `${s}s`
}

export default function Live({ goTab }: { goTab: (t: string) => void }) {
  const [page, setPage] = useState(0)
  const [following, setFollowing] = useState(streams.map(s => s.following))
  const startY = useRef(0)
  const moved = useRef(false)

  const s = streams[page]
  const it = s.item
  const pct = Math.max(0, Math.min(100, (it.remSec / it.totalSec) * 100))
  const bc = pct < 25 ? '#D94F45' : pct < 50 ? '#E8942A' : '#4CAF50'

  function onMouseDown(e: React.MouseEvent) { startY.current = e.clientY; moved.current = false }
  function onMouseMove(e: React.MouseEvent) { if (Math.abs(e.clientY - startY.current) > 8) moved.current = true }
  function onMouseUp(e: React.MouseEvent) {
    if (!moved.current) return
    const dy = e.clientY - startY.current
    if (dy < -50 && page < streams.length - 1) setPage(p => p + 1)
    else if (dy > 50 && page > 0) setPage(p => p - 1)
  }
  function onWheel(e: React.WheelEvent) {
    if (e.deltaY > 30 && page < streams.length - 1) setPage(p => p + 1)
    else if (e.deltaY < -30 && page > 0) setPage(p => p - 1)
  }

  return (
    <div
      style={{ position:'absolute', inset:0, background:'#000', zIndex:200, userSelect:'none', cursor:'grab' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onWheel={onWheel}
    >
      <div style={{ position:'absolute', inset:0, background:s.bg }}/>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,.97) 0%,rgba(0,0,0,.2) 55%,transparent 100%)' }}/>

      {/* ✕ QUITTER */}
      <button onClick={()=>goTab('home')} style={{ position:'absolute', top:16, right:16, zIndex:20, width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,.55)', border:'1.5px solid rgba(255,255,255,.3)', color:'#fff', fontSize:18, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>

      {/* TOP */}
      <div style={{ position:'absolute', top:16, left:16, zIndex:20, display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ fontSize:17, fontWeight:800, color:'#fff' }}>Kilee<span style={{color:P}}>r</span></div>
        <div style={{ background:P, color:'#fff', fontSize:9, fontWeight:700, padding:'3px 10px', borderRadius:20, display:'flex', alignItems:'center', gap:4 }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:'#fff' }}/>
          LIVE
        </div>
      </div>
      <div style={{ position:'absolute', top:54, left:16, zIndex:20, background:'rgba(0,0,0,.45)', color:'#fff', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>
        {page+1}/{streams.length}
      </div>

      {/* EMOJI FOND */}
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:100, opacity:.15, pointerEvents:'none' }}>
        {s.emoji}
      </div>

      {/* ACTIONS DROITE */}
      <div style={{ position:'absolute', right:12, bottom:220, zIndex:20, display:'flex', flexDirection:'column', gap:14, alignItems:'center' }}>
        {[
          { ico: following[page] ? '✓' : '+', label: following[page] ? 'Abonné' : 'Suivre', action: () => setFollowing(f => f.map((v,i) => i===page ? !v : v)), bg: following[page] ? P : 'rgba(255,255,255,.12)' },
          { ico: '💬', label: `${it.bids}`, action: ()=>{} },
          { ico: '🤍', label: 'Favori', action: ()=>{} },
        ].map((btn, i) => (
          <div key={i} onClick={btn.action} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, cursor:'pointer' }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background: btn.bg||'rgba(255,255,255,.12)', border:'0.5px solid rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:i===0?14:18, color:'#fff', fontWeight:700 }}>{btn.ico}</div>
            <div style={{ fontSize:8, color:'rgba(255,255,255,.65)' }}>{btn.label}</div>
          </div>
        ))}
      </div>

      {/* CONTENU BAS */}
      <div style={{ position:'absolute', bottom:65, left:0, right:0, padding:'0 14px', zIndex:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
          <div style={{ width:36, height:36, borderRadius:'50%', border:`2px solid ${P}`, background:'#222', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{s.emoji}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:800, color:'#fff' }}>{s.name}</div>
            <div style={{ fontSize:9, color:'rgba(255,255,255,.55)' }}>{s.handle} · {s.sub}</div>
          </div>
        </div>
        <div style={{ background:'rgba(0,0,0,.3)', borderRadius:10, padding:'6px 10px', marginBottom:8 }}>
          {s.chat.map((m, i) => (
            <div key={i} style={{ fontSize:10, color:'rgba(255,255,255,.8)', marginBottom:2 }}>
              <span style={{ color:m.color, fontWeight:700 }}>{m.user}</span> {m.text}
            </div>
          ))}
        </div>
        <div style={{ background:'rgba(255,255,255,.08)', border:'0.5px solid rgba(255,255,255,.12)', borderRadius:14, padding:11 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:7 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:'rgba(255,255,255,.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{s.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>{it.title}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:18, fontWeight:800, color:P }}>{it.price.toLocaleString('fr-FR')} €</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,.45)' }}>{it.bids} offres</div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
            <span style={{ fontSize:10, color:'rgba(255,255,255,.4)' }}>Temps restant</span>
            <span style={{ fontSize:18, fontWeight:800, color:'#fff' }}>{fmt(it.remSec)}</span>
          </div>
          <div style={{ height:4, background:'rgba(255,255,255,.1)', borderRadius:3, overflow:'hidden', marginBottom:10 }}>
            <div style={{ width:`${pct}%`, height:'100%', borderRadius:3, background:bc }}/>
          </div>
          <div style={{ display:'flex', gap:7 }}>
            <div style={{ flex:1, background:'rgba(255,255,255,.1)', border:`0.5px solid ${P}`, borderRadius:20, padding:'0 12px', display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ fontSize:12, fontWeight:700, color:P }}>€</span>
              <input placeholder="Votre offre…" style={{ flex:1, border:'none', background:'transparent', fontSize:12, color:'#fff', padding:'8px 0', outline:'none' }}/>
            </div>
            <button style={{ padding:'8px 14px', background:P, border:'none', borderRadius:20, fontSize:11, fontWeight:700, color:'#fff', cursor:'pointer' }}>Enchérir</button>
          </div>
        </div>
        <div style={{ display:'flex', gap:4, justifyContent:'center', marginTop:8 }}>
          {streams.map((_,i) => (
            <div key={i} style={{ height:5, borderRadius:3, background: i===page ? '#fff' : 'rgba(255,255,255,.2)', width: i===page ? 14 : 5, transition:'all .2s' }}/>
          ))}
        </div>
        <div style={{ fontSize:9, color:'rgba(255,255,255,.35)', textAlign:'center', marginTop:4 }}>
          {page > 0 ? '↑ stream préc.' : ''} {page < streams.length-1 ? '↓ stream suiv.' : ''}
        </div>
      </div>

      {/* TABBAR */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'rgba(0,0,0,.8)', borderTop:'0.5px solid rgba(255,255,255,.1)', padding:'7px 0 9px', display:'flex', zIndex:15 }}>
        {[['🏠','Accueil','home'],['📡','Live','live'],['➕','Vendre','sell'],['⚡','Express','express'],['👤','Moi','me']].map(([ico,lbl,id]) => (
          <button key={id} onClick={()=>goTab(id)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2, border:'none', background:'transparent', cursor:'pointer', fontSize:8, color: id==='live' ? P : 'rgba(255,255,255,.35)', fontWeight:600 }}>
            <span style={{ fontSize:17 }}>{ico}</span>{lbl}
          </button>
        ))}
      </div>
    </div>
  )
}