import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

const P = '#D94F45'

const streams = [
  { name:'MusiqueStore', emoji:'🎸', bg:'#1a0805', price:340, viewers:142 },
  { name:'LeatherCo',   emoji:'👜', bg:'#0a1505', price:180, viewers:87  },
  { name:'PhotoPro',    emoji:'📷', bg:'#05080f', price:890, viewers:312 },
]

export default function Home({ goTab, onItemClick }: { goTab: (t: string) => void, onItemClick: (item: any) => void }) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadItems()
  }, [])

  async function loadItems() {
    const { data } = await supabase
      .from('items')
      .select('*')
      .eq('type', 'fixed')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    if (data) setItems(data)
    setLoading(false)
  }

  const cardHtml = (it: any, small = false) => (
    <div key={it.id} onClick={() => onItemClick(it)} style={{ background:'#fff', border:'0.5px solid #f0eded', borderRadius:14, overflow:'hidden', cursor:'pointer', ...(small ? { minWidth:130, flexShrink:0 } : {}) }}>
      <div style={{ height: small ? 75 : 90, display:'flex', alignItems:'center', justifyContent:'center', background:'#FDEDEC', fontSize: small ? 26 : 30, position:'relative', overflow:'hidden' }}>
        {it.image_url ? (
          <img src={it.image_url} alt={it.title} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
        ) : (
          <span>{it.emoji}</span>
        )}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:P }}/>
      </div>
      <div style={{ padding: small ? '6px 8px 8px' : '7px 9px 9px' }}>
        <div style={{ fontSize: small ? 10 : 11, fontWeight:700, color:'#111', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{it.title}</div>
        <div style={{ fontSize:9, color:'#aaa', margin:'2px 0 5px' }}>{it.category}</div>
        <div style={{ fontSize: small ? 12 : 14, fontWeight:800, color:P, marginBottom: small ? 5 : 7 }}>{it.price?.toLocaleString('fr-FR')} €</div>
        <button onClick={e => { e.stopPropagation(); onItemClick(it) }} style={{ width:'100%', padding: small ? 5 : 6, borderRadius:20, border:'none', fontSize: small ? 9 : 10, fontWeight:700, cursor:'pointer', color:'#fff', background:P }}>
          Acheter
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ paddingBottom:80 }}>

      {/* HEADER */}
      <div style={{ background:P, padding:'8px 14px 0' }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'#fff', marginBottom:6 }}>
          <span>9:41</span><span>▶ ⬛</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingBottom:10 }}>
          <div style={{ fontSize:22, fontWeight:800, color:'#fff', letterSpacing:-.5 }}>Kileer</div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={()=>goTab('live')} style={iconBtn}>📡</button>
            <button onClick={()=>goTab('express')} style={iconBtn}>⚡</button>
            <div style={avatarStyle}>JD</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,.15)', borderRadius:22, padding:'0 13px', border:'1px solid rgba(255,255,255,.25)', marginBottom:10 }}>
          <span style={{ color:'rgba(255,255,255,.7)' }}>🔍</span>
          <input placeholder="Rechercher articles, vendeurs…" style={{ flex:1, border:'none', background:'transparent', fontSize:12, color:'#fff', padding:'8px 0', outline:'none' }}/>
        </div>
      </div>

      {/* CATÉGORIES */}
      <div style={{ display:'flex', gap:5, padding:'10px 14px', overflowX:'auto', background:'#fff', borderBottom:'0.5px solid #f0eded' }}>
        {['Pour toi','Art','Mode','Tech','Déco','Musique'].map((c,i) => (
          <button key={c} style={{ padding:'5px 12px', borderRadius:20, fontSize:11, fontWeight:600, border:'none', cursor:'pointer', whiteSpace:'nowrap', background:i===0?P:'#f5f5f5', color:i===0?'#fff':'#999' }}>{c}</button>
        ))}
      </div>

      {/* LIVES */}
      <div style={{ background:'#fff' }}>
        <div style={secTtl}>
          <span>🔴 Lives en cours</span>
          <span style={{ fontSize:10, color:P, cursor:'pointer' }} onClick={()=>goTab('live')}>Voir tout</span>
        </div>
        <div style={{ display:'flex', gap:9, padding:'0 14px 12px', overflowX:'auto' }}>
          {streams.map((s,i) => (
            <div key={i} onClick={()=>goTab('live')} style={{ position:'relative', width:110, minWidth:110, borderRadius:12, overflow:'hidden', cursor:'pointer', border:`2px solid ${P}` }}>
              <div style={{ height:140, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:40, position:'relative' }}>
                {s.emoji}
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(60,10,10,.92) 0%,transparent 55%)' }}/>
                <div style={{ position:'absolute', top:7, left:7, background:P, color:'#fff', fontSize:8, fontWeight:700, padding:'2px 6px', borderRadius:3 }}>● LIVE</div>
                <div style={{ position:'absolute', top:7, right:7, background:'rgba(0,0,0,.4)', color:'#fff', fontSize:8, padding:'2px 5px', borderRadius:9 }}>👁 {s.viewers}</div>
                <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:7 }}>
                  <div style={{ fontSize:9, fontWeight:700, color:'#fff' }}>{s.name}</div>
                  <div style={{ fontSize:10, fontWeight:800, color:'#ffb3ae', marginTop:1 }}>{s.price.toLocaleString('fr-FR')} €</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EXPRESS */}
      <div onClick={()=>goTab('express')} style={{ margin:'0 14px 10px', background:'linear-gradient(135deg,#1a0a08,#3a0f0a)', borderRadius:12, padding:'10px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' }}>
        <div>
          <div style={{ fontSize:12, fontWeight:800, color:'#fff' }}>⚡ Enchères Express</div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,.6)', marginTop:1 }}>3 vendeurs · &lt;3 min</div>
        </div>
        <div style={{ background:P, color:'#fff', fontSize:10, fontWeight:700, padding:'5px 12px', borderRadius:20 }}>Voir →</div>
      </div>

      {/* POUR TOI */}
      <div style={{ background:'#fafafa' }}>
        <div style={{ ...secTtl, background:'#fafafa' }}>
          <span>✨ Pour toi</span>
          <span style={{ fontSize:10, color:P }}>{items.length} articles</span>
        </div>
        {loading && <div style={{ textAlign:'center', padding:'30px', color:'#aaa', fontSize:13 }}>Chargement…</div>}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8, padding:'0 14px' }}>
          {items.slice(0,4).map(it => cardHtml(it, false))}
        </div>
        {items.length > 4 && (
          <div>
            <div style={{ padding:'8px 14px 4px', fontSize:11, fontWeight:600, color:'#aaa' }}>Voir aussi →</div>
            <div style={{ display:'flex', gap:8, padding:'0 14px 8px', overflowX:'auto' }}>
              {items.slice(4).map(it => cardHtml(it, true))}
            </div>
          </div>
        )}
      </div>

      {/* FIL D'ACTUALITÉ */}
      <div style={{ background:'#fff', borderTop:'4px solid #f5f5f5', marginTop:10, paddingBottom:10 }}>
        <div style={{ padding:'10px 14px 8px', display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:13, fontWeight:800, color:'#111' }}>📰 Fil d'actualité</span>
        </div>
        {[
          { emoji:'🎸', seller:'MusiqueStore', color:'#D94F45', bg:'#1a0805', title:'MusiqueStore est en LIVE !', desc:'Vente de guitares vintage — 142 spectateurs', time:'Maintenant', type:'live', viewers:142 },
          { emoji:'👟', seller:'SneakerKing',  color:'#7c3aed', bg:'',        title:'Nouvelle enchère : Air Jordan 1', desc:'SneakerKing vient de mettre en vente une paire neuve', time:'3min', type:'vente', price:'95 €' },
          { emoji:'💍', seller:'BijouxParis',  color:'#e6732a', bg:'',        title:'⚡ Express — Bague argent', desc:'Seulement 2 minutes restantes !', time:'1min', type:'express', price:'28 €' },
        ].map((a,i) => (
          <div key={i} onClick={()=>a.type==='live'?goTab('live'):a.type==='express'?goTab('express'):undefined} style={{ background:'#fff', border:'0.5px solid #f0eded', borderRadius:14, margin:'0 14px 10px', overflow:'hidden', cursor:'pointer' }}>
            <div style={{ height:110, background:a.bg||'#FDEDEC', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, position:'relative' }}>
              {a.emoji}
              {a.type==='live' && <>
                <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.35)' }}/>
                <div style={{ position:'absolute', top:10, left:10, background:P, color:'#fff', fontSize:9, fontWeight:700, padding:'3px 9px', borderRadius:4 }}>● LIVE</div>
                <div style={{ position:'absolute', top:10, right:10, background:'rgba(0,0,0,.5)', color:'#fff', fontSize:9, padding:'3px 8px', borderRadius:10 }}>👁 {a.viewers}</div>
              </>}
              {a.type==='express' && <div style={{ position:'absolute', top:10, left:10, background:P, color:'#fff', fontSize:9, fontWeight:700, padding:'3px 9px', borderRadius:10 }}>⚡ EXPRESS</div>}
              <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:P }}/>
            </div>
            <div style={{ padding:'10px 12px 12px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
                <div style={{ width:20, height:20, borderRadius:'50%', background:a.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:700, color:'#fff' }}>{a.seller[0]}</div>
                <span style={{ fontSize:11, fontWeight:600, color:'#666' }}>{a.seller}</span>
                <span style={{ fontSize:10, color:'#bbb', marginLeft:'auto' }}>il y a {a.time}</span>
              </div>
              <div style={{ fontSize:13, fontWeight:700, color:'#111', marginBottom:4 }}>{a.title}</div>
              <div style={{ fontSize:11, color:'#888', lineHeight:1.5, marginBottom:8 }}>{a.desc}</div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                {'price' in a && a.price ? <div style={{ fontSize:15, fontWeight:800, color:P }}>{a.price}</div> : <div/>}
                <button style={{ padding:'7px 16px', background:P, border:'none', borderRadius:20, fontSize:11, fontWeight:700, color:'#fff', cursor:'pointer' }}>
                  {a.type==='live' ? 'Rejoindre' : a.type==='express' ? 'Express →' : 'Voir'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

const iconBtn: CSSProperties = { width:28, height:28, borderRadius:'50%', background:'rgba(255,255,255,.2)', border:'none', cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center' }
const avatarStyle: CSSProperties = { width:28, height:28, borderRadius:'50%', background:'#fff', border:'2px solid rgba(255,255,255,.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:P, cursor:'pointer' }
const secTtl: CSSProperties = { fontSize:12, fontWeight:700, color:'#111', padding:'10px 14px 6px', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#fff' }