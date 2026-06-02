import { useState, useRef } from 'react'

const P = '#D94F45'

const vendeurs = [
  {
    name: 'SneakerKing', handle: '@sneakerking', emoji: '👟',
    bg: 'linear-gradient(160deg,#1a0a3a,#0d0520)',
    following: false, followers: 2341,
    items: [
      { id:1, emoji:'👟', title:'Nike Air Jordan 1 Retro', price:95,  bids:8,  totalSec:172, remSec:152 },
      { id:2, emoji:'👟', title:'Adidas Yeezy 350 V2',     price:180, bids:14, totalSec:150, remSec:130 },
    ]
  },
  {
    name: 'GamerZone', handle: '@gamerzone', emoji: '🎮',
    bg: 'linear-gradient(160deg,#0a1a1a,#052015)',
    following: true, followers: 1876,
    items: [
      { id:3, emoji:'🎮', title:'Manette PS5 Limitée',   price:45, bids:14, totalSec:87,  remSec:57 },
      { id:4, emoji:'🕹️', title:'Joycons Switch Custom', price:32, bids:6,  totalSec:120, remSec:95 },
    ]
  },
  {
    name: 'BijouxParis', handle: '@bijouxparis', emoji: '💍',
    bg: 'linear-gradient(160deg,#1a0a10,#200510)',
    following: false, followers: 987,
    items: [
      { id:5, emoji:'💍', title:'Bague argent vintage', price:28,  bids:3, totalSec:155, remSec:135 },
      { id:6, emoji:'📿', title:'Collier or 18 carats', price:120, bids:9, totalSec:180, remSec:162 },
    ]
  },
  {
    name: 'VintageShop', handle: '@vintageshop', emoji: '🧥',
    bg: 'linear-gradient(160deg,#1a1000,#200d00)',
    following: false, followers: 3102,
    items: [
      { id:7, emoji:'🧥', title:"Veste Levi's 90s", price:62, bids:6, totalSec:60, remSec:38 },
    ]
  },
]

function fmtEx(s: number) {
  if (s <= 0) return 'FIN'
  const m = Math.floor(s / 60)
  const sc = s % 60
  return `${String(m).padStart(2,'0')}:${String(sc).padStart(2,'0')}`
}

function pct(remSec: number, totalSec: number) {
  return totalSec > 0 ? Math.max(0, Math.min(100, (remSec / totalSec) * 100)) : 0
}

function barCol(p: number) {
  return p < 25 ? '#D94F45' : p < 50 ? '#E8942A' : '#4CAF50'
}

export default function Express({ goTab }: { goTab: (t: string) => void }) {
  const [page, setPage] = useState(0)
  const [itemIdx, setItemIdx] = useState(vendeurs.map(() => 0))
  const [following, setFollowing] = useState(vendeurs.map(v => v.following))
  const startY = useRef(0)
  const moved = useRef(false)

  const v = vendeurs[page]
  const idx = itemIdx[page]
  const it = v.items[idx]
  const p = pct(it.remSec, it.totalSec)
  const bc = barCol(p)
  const urg = it.remSec <= 30 && it.remSec > 0
  const ended = it.remSec <= 0

  function onMouseDown(e: React.MouseEvent) { startY.current = e.clientY; moved.current = false }
  function onMouseMove(e: React.MouseEvent) { if (Math.abs(e.clientY - startY.current) > 8) moved.current = true }
  function onMouseUp(e: React.MouseEvent) {
    if (!moved.current) return
    const dy = e.clientY - startY.current
    if (dy < -50 && page < vendeurs.length - 1) setPage(p => p + 1)
    else if (dy > 50 && page > 0) setPage(p => p - 1)
  }
  function onWheel(e: React.WheelEvent) {
    if (e.deltaY > 30 && page < vendeurs.length - 1) setPage(p => p + 1)
    else if (e.deltaY < -30 && page > 0) setPage(p => p - 1)
  }

  function nextItem() {
    if (idx < v.items.length - 1) {
      setItemIdx(arr => arr.map((v,i) => i===page ? v+1 : v))
    }
  }

  return (
    <div
      style={{ position:'absolute', inset:0, background:'#000', zIndex:200, userSelect:'none', cursor:'grab' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onWheel={onWheel}
    >
      <div style={{ position:'absolute', inset:0, background:v.bg }}/>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,.97) 0%,rgba(0,0,0,.2) 55%,transparent 100%)' }}/>

      {/* ✕ QUITTER */}
      <button onClick={()=>goTab('home')} style={{ position:'absolute', top:16, right:16, zIndex:20, width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,.55)', border:'1.5px solid rgba(255,255,255,.3)', color:'#fff', fontSize:18, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>

      {/* TOP */}
      <div style={{ position:'absolute', top:16, left:16, zIndex:20, display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ fontSize:17, fontWeight:800, color:'#fff' }}>Kilee<span style={{color:P}}>r</span></div>
        <div style={{ background:P, color:'#fff', fontSize:9, fontWeight:700, padding:'3px 10px', borderRadius:20, display:'flex', alignItems:'center', gap:4 }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:'#fff' }}/>
          EXPRESS
        </div>
      </div>
      <div style={{ position:'absolute', top:54, left:16, zIndex:20, background:'rgba(0,0,0,.45)', color:'#fff', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>{page+1}/{vendeurs.length}</div>

      {/* EMOJI FOND */}
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:100, opacity:.12, pointerEvents:'none' }}>{v.emoji}</div>

      {/* ENDED */}
      {ended && (
        <div style={{ position:'absolute', inset:0, zIndex:8, background:'rgba(0,0,0,.7)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:10 }}>
          <div style={{ fontSize:42 }}>⏱️</div>
          <div style={{ fontSize:15, fontWeight:800, color:'#fff' }}>Enchère terminée !</div>
          {idx < v.items.length-1 && <button onClick={nextItem} style={{ padding:'9px 22px', background:P, border:'none', borderRadius:20, fontSize:12, fontWeight:700, color:'#fff', cursor:'pointer' }}>Article suivant →</button>}
        </div>
      )}

      {/* ACTIONS DROITE */}
      <div style={{ position:'absolute', right:12, bottom:200, zIndex:20, display:'flex', flexDirection:'column', gap:12, alignItems:'center' }}>
        {[
          { ico: following[page] ? '✓' : '+', label: following[page] ? 'Abonné' : 'Suivre', action: () => setFollowing(f => f.map((v,i) => i===page ? !v : v)), bg: following[page] ? P : 'rgba(255,255,255,.12)' },
          { ico: '💬', label: `${it.bids}`, action: ()=>{} },
          { ico: '🤍', label: 'Favori', action: ()=>{} },
          ...(v.items.length > 1 ? [{ ico: '⬇️', label: `${idx+1}/${v.items.length}`, action: nextItem, bg: 'rgba(255,255,255,.12)' }] : []),
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
          <div style={{ width:36, height:36, borderRadius:'50%', border:`2px solid ${P}`, background:'#222', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{v.emoji}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:800, color:'#fff' }}>{v.name}</div>
            <div style={{ fontSize:9, color:'rgba(255,255,255,.55)' }}>{v.handle} · {v.followers.toLocaleString()} abonnés</div>
          </div>
          <button onClick={()=>setFollowing(f=>f.map((val,i)=>i===page?!val:val))} style={{ padding:'5px 12px', borderRadius:20, fontSize:10, fontWeight:700, cursor:'pointer', border:'none', background: following[page] ? 'rgba(255,255,255,.15)' : P, color:'#fff' }}>
            {following[page] ? '✓ Abonné' : '+ Suivre'}
          </button>
        </div>
        <div style={{ background:'rgba(255,255,255,.08)', border:'0.5px solid rgba(255,255,255,.12)', borderRadius:14, padding:11, marginBottom:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
            <div style={{ width:44, height:44, borderRadius:10, background:'rgba(255,255,255,.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{it.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>{it.title}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,.45)', marginTop:1 }}>Art. {idx+1}/{v.items.length}</div>
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:7 }}>
            <div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,.4)', marginBottom:2 }}>Enchère</div>
              <div style={{ fontSize:20, fontWeight:800, color:P }}>{it.price.toLocaleString('fr-FR')} €</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,.45)' }}>{it.bids} offres</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:10, color:'rgba(255,255,255,.4)', marginBottom:3 }}>Temps</div>
              <div style={{ fontSize:22, fontWeight:800, color: urg ? P : '#fff' }}>{fmtEx(it.remSec)}</div>
            </div>
          </div>
          <div style={{ height:4, background:'rgba(255,255,255,.1)', borderRadius:3, overflow:'hidden', marginBottom:10 }}>
            <div style={{ width:`${p}%`, height:'100%', borderRadius:3, background:bc, transition:'width .8s' }}/>
          </div>
          {!ended && (
            <div style={{ display:'flex', gap:7 }}>
              <div style={{ flex:1, background:'rgba(255,255,255,.1)', border:`0.5px solid ${P}`, borderRadius:20, padding:'0 12px', display:'flex', alignItems:'center', gap:5 }}>
                <span style={{ fontSize:12, fontWeight:700, color:P }}>€</span>
                <input placeholder="Votre offre…" style={{ flex:1, border:'none', background:'transparent', fontSize:12, color:'#fff', padding:'8px 0', outline:'none' }}/>
              </div>
              <button style={{ padding:'8px 14px', background:P, border:'none', borderRadius:20, fontSize:11, fontWeight:700, color:'#fff', cursor:'pointer' }}>Enchérir</button>
            </div>
          )}
        </div>
        <div style={{ display:'flex', gap:4, justifyContent:'center', marginBottom:4 }}>
          {vendeurs.map((_,i) => (
            <div key={i} style={{ height:5, borderRadius:3, background: i===page ? '#fff' : 'rgba(255,255,255,.2)', width: i===page ? 14 : 5, transition:'all .2s' }}/>
          ))}
        </div>
        <div style={{ fontSize:9, color:'rgba(255,255,255,.35)', textAlign:'center' }}>
          {page > 0 ? '↑ vendeur préc.' : ''} {page < vendeurs.length-1 ? '↓ vendeur suiv.' : ''}
        </div>
      </div>

      {/* TABBAR */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'rgba(0,0,0,.8)', borderTop:'0.5px solid rgba(255,255,255,.1)', padding:'7px 0 9px', display:'flex', zIndex:15 }}>
        {[['🏠','Accueil','home'],['📡','Live','live'],['➕','Vendre','sell'],['⚡','Express','express'],['👤','Moi','me']].map(([ico,lbl,id]) => (
          <button key={id} onClick={()=>goTab(id)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2, border:'none', background:'transparent', cursor:'pointer', fontSize:8, color: id==='express' ? P : 'rgba(255,255,255,.35)', fontWeight:600 }}>
            <span style={{ fontSize:17 }}>{ico}</span>{lbl}
          </button>
        ))}
      </div>
    </div>
  )
}