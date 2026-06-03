import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

const P = '#D94F45'

const cats = [
  { k:'art',     l:'Art',     emoji:'🎨', color:'#e6732a' },
  { k:'mode',    l:'Mode',    emoji:'👜', color:'#7c3aed' },
  { k:'tech',    l:'Tech',    emoji:'💻', color:'#0891b2' },
  { k:'deco',    l:'Déco',    emoji:'🪑', color:'#059669' },
  { k:'musique', l:'Musique', emoji:'🎸', color:'#D94F45' },
  { k:'sport',   l:'Sport',   emoji:'⚽', color:'#2E7D32' },
  { k:'jouets',  l:'Jouets',  emoji:'🧸', color:'#e6732a' },
  { k:'livres',  l:'Livres',  emoji:'📚', color:'#0891b2' },
  { k:'maison',  l:'Maison',  emoji:'🏠', color:'#059669' },
  { k:'auto',    l:'Auto',    emoji:'🚗', color:'#7c3aed' },
]

export default function Categories({ goBack, onItemClick }: { goBack: () => void, onItemClick: (item: any) => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selected) loadItems(selected)
  }, [selected])

  async function loadItems(cat: string) {
    setLoading(true)
    const { data } = await supabase
      .from('items')
      .select('*')
      .eq('category', cat)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    if (data) setItems(data)
    setLoading(false)
  }

  async function searchItems(q: string) {
    setSearch(q)
    if (q.length < 2) { setItems([]); setSelected(null); return }
    setLoading(true)
    const { data } = await supabase
      .from('items')
      .select('*')
      .eq('status', 'active')
      .ilike('title', `%${q}%`)
      .order('created_at', { ascending: false })
    if (data) setItems(data)
    setLoading(false)
  }

  return (
    <div style={{ paddingBottom:80, background:'#fafafa', minHeight:'100vh' }}>

      {/* HEADER */}
      <div style={{ background:P, padding:'12px 14px 14px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
          <button onClick={goBack} style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,.2)', border:'none', cursor:'pointer', fontSize:16, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
          <div style={{ fontSize:16, fontWeight:800, color:'#fff' }}>Catégories & Recherche</div>
        </div>
        {/* BARRE DE RECHERCHE */}
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,.15)', borderRadius:22, padding:'0 13px', border:'1px solid rgba(255,255,255,.25)' }}>
          <span style={{ color:'rgba(255,255,255,.7)' }}>🔍</span>
          <input
            value={search}
            onChange={e => searchItems(e.target.value)}
            placeholder="Rechercher un article…"
            style={{ flex:1, border:'none', background:'transparent', fontSize:13, color:'#fff', padding:'10px 0', outline:'none' }}
          />
          {search && (
            <button onClick={()=>{ setSearch(''); setItems([]); setSelected(null) }} style={{ background:'transparent', border:'none', color:'rgba(255,255,255,.7)', cursor:'pointer', fontSize:16 }}>✕</button>
          )}
        </div>
      </div>

      {/* CATÉGORIES */}
      {!search && (
        <div style={{ padding:'14px 14px 0' }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#111', marginBottom:10 }}>Toutes les catégories</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8, marginBottom:16 }}>
            {cats.map(c => (
              <div key={c.k} onClick={()=>setSelected(selected===c.k ? null : c.k)} style={{ background: selected===c.k ? c.color : '#fff', border:`0.5px solid ${selected===c.k ? c.color : '#f0eded'}`, borderRadius:14, padding:'14px 12px', display:'flex', alignItems:'center', gap:10, cursor:'pointer', transition:'all .2s' }}>
                <div style={{ width:40, height:40, borderRadius:10, background: selected===c.k ? 'rgba(255,255,255,.2)' : `${c.color}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>
                  {c.emoji}
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color: selected===c.k ? '#fff' : '#111' }}>{c.l}</div>
                  <div style={{ fontSize:10, color: selected===c.k ? 'rgba(255,255,255,.7)' : '#aaa', marginTop:1 }}>
                    {selected===c.k ? `${items.length} articles` : 'Voir →'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RÉSULTATS */}
      {(selected || search.length >= 2) && (
        <div style={{ padding:'0 14px' }}>
          <div style={{ fontSize:12, fontWeight:700, color:'#aaa', marginBottom:10, marginTop: search ? 14 : 0 }}>
            {search ? `Résultats pour "${search}"` : `Catégorie : ${cats.find(c=>c.k===selected)?.l}`} — {items.length} article{items.length>1?'s':''}
          </div>

          {loading && <div style={{ textAlign:'center', padding:30, color:'#aaa' }}>Chargement…</div>}

          {!loading && items.length === 0 && (
            <div style={{ textAlign:'center', padding:30 }}>
              <div style={{ fontSize:32, marginBottom:10 }}>🔍</div>
              <div style={{ fontSize:13, fontWeight:700, color:'#111', marginBottom:4 }}>Aucun article trouvé</div>
              <div style={{ fontSize:11, color:'#aaa' }}>Essayez une autre catégorie</div>
            </div>
          )}

          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8 }}>
            {items.map(it => (
              <div key={it.id} onClick={() => onItemClick(it)} style={{ background:'#fff', border:'0.5px solid #f0eded', borderRadius:14, overflow:'hidden', cursor:'pointer' }}>
                <div style={{ height:90, display:'flex', alignItems:'center', justifyContent:'center', background:'#FDEDEC', fontSize:30, position:'relative', overflow:'hidden' }}>
                  {it.image_url ? (
                    <img src={it.image_url} alt={it.title} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                  ) : <span>{it.emoji}</span>}
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:P }}/>
                </div>
                <div style={{ padding:'7px 9px 9px' }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'#111', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{it.title}</div>
                  <div style={{ fontSize:9, color:'#aaa', margin:'2px 0 5px' }}>{it.category}</div>
                  <div style={{ fontSize:14, fontWeight:800, color:P, marginBottom:7 }}>{it.price?.toLocaleString('fr-FR')} €</div>
                  <button onClick={e=>{ e.stopPropagation(); onItemClick(it) }} style={{ width:'100%', padding:6, borderRadius:20, border:'none', fontSize:10, fontWeight:700, cursor:'pointer', color:'#fff', background:P }}>
                    Voir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}