import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

const P = '#D94F45'

export default function SellerProfile({ sellerId, goBack, onItemClick }: { sellerId: string, goBack: () => void, onItemClick: (item: any) => void }) {
  const [profile, setProfile] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState(false)

  useEffect(() => { loadSeller() }, [sellerId])

  async function loadSeller() {
    setLoading(true)

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sellerId)
      .single()
    if (profile) setProfile(profile)

    const { data: items } = await supabase
      .from('items')
      .select('*')
      .eq('seller_id', sellerId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    if (items) setItems(items)

    setLoading(false)
  }

  const totalVues    = items.reduce((s,i) => s+(i.views||0), 0)
  const totalFavoris = items.reduce((s,i) => s+(i.favorites||0), 0)
  const displayName  = profile?.username ? `@${profile.username}` : profile?.full_name || 'Vendeur'
  const realName     = profile?.show_real_name !== false ? profile?.full_name : null
  const initials     = profile?.full_name ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0,2) : '?'

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div style={{ fontSize:13, color:'#aaa' }}>Chargement…</div>
    </div>
  )

  return (
    <div style={{ paddingBottom:80, background:'#fafafa', minHeight:'100vh' }}>

      {/* COUVERTURE */}
      <div style={{ position:'relative' }}>
        <div style={{ height:120, overflow:'hidden', position:'relative' }}>
          {profile?.cover_url ? (
            <img src={profile.cover_url} alt="cover" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
          ) : (
            <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg,${P},#b03028)` }}/>
          )}
          {/* BOUTON RETOUR */}
          <button onClick={goBack} style={{ position:'absolute', top:12, left:12, width:32, height:32, borderRadius:'50%', background:'rgba(0,0,0,.5)', border:'none', cursor:'pointer', fontSize:16, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
        </div>

        {/* AVATAR */}
        <div style={{ position:'absolute', top:94, left:14, zIndex:10 }}>
          <div style={{ width:56, height:56, borderRadius:'50%', background:'#fff', border:'3px solid #fff', boxShadow:'0 2px 8px rgba(0,0,0,.2)', overflow:'hidden', position:'relative' }}>
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
            ) : (
              <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700, color:P, background:'#fff' }}>
                {initials}
              </div>
            )}
          </div>
        </div>

        {/* BOUTON SUIVRE */}
        <div style={{ position:'absolute', top:130, right:14, zIndex:10 }}>
          <button onClick={()=>setFollowing(!following)} style={{ padding:'7px 16px', borderRadius:20, border:`1.5px solid ${following ? '#ccc' : P}`, background: following ? '#f5f5f5' : P, color: following ? '#aaa' : '#fff', fontSize:11, fontWeight:700, cursor:'pointer' }}>
            {following ? '✓ Abonné' : '+ Suivre'}
          </button>
        </div>
      </div>

      {/* INFOS */}
      <div style={{ padding:'34px 14px 10px', background:'#fafafa' }}>
        <div style={{ fontSize:16, fontWeight:800, color:'#111' }}>{displayName}</div>
        {realName && profile?.username && (
          <div style={{ fontSize:10, color:'#aaa', marginTop:2 }}>{realName}</div>
        )}
        {profile?.bio && (
          <div style={{ fontSize:11, color:'#555', marginTop:5, lineHeight:1.5 }}>{profile.bio}</div>
        )}
        <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:5 }}>
          <span style={{ fontSize:10, color:'#2E7D32', fontWeight:600 }}>✓ Vendeur vérifié</span>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display:'flex', background:'#fff', border:'0.5px solid #f0eded', borderRadius:12, margin:'10px 14px', overflow:'hidden' }}>
        {[
          [String(items.length), 'Articles'],
          [String(totalVues),    'Vues'],
          [String(totalFavoris), 'Favoris'],
          ['⭐ -',               'Note'],
        ].map(([n,l]) => (
          <div key={l} style={{ flex:1, padding:'9px 0', textAlign:'center', borderRight:'0.5px solid #f0eded' }}>
            <div style={{ fontSize:14, fontWeight:800, color:P }}>{n}</div>
            <div style={{ fontSize:9, color:'#bbb' }}>{l}</div>
          </div>
        ))}
      </div>

      {/* ARTICLES */}
      <div style={{ padding:'0 14px' }}>
        <div style={{ fontSize:13, fontWeight:700, color:'#111', marginBottom:10 }}>
          Articles en vente ({items.length})
        </div>

        {items.length === 0 && (
          <div style={{ textAlign:'center', padding:30 }}>
            <div style={{ fontSize:32, marginBottom:8 }}>📦</div>
            <div style={{ fontSize:13, color:'#aaa' }}>Aucun article en vente</div>
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
                <div style={{ position:'absolute', bottom:4, right:6, background:'rgba(0,0,0,.4)', color:'#fff', fontSize:8, padding:'2px 5px', borderRadius:8, display:'flex', alignItems:'center', gap:3 }}>
                  👁 {it.views || 0}
                </div>
              </div>
              <div style={{ padding:'7px 9px 9px' }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#111', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{it.title}</div>
                <div style={{ fontSize:9, color:'#aaa', margin:'2px 0 5px' }}>{it.category}</div>
                <div style={{ fontSize:14, fontWeight:800, color:P, marginBottom:6 }}>{it.price?.toLocaleString('fr-FR')} €</div>
                <button onClick={e=>{ e.stopPropagation(); onItemClick(it) }} style={{ width:'100%', padding:6, borderRadius:20, border:'none', fontSize:10, fontWeight:700, cursor:'pointer', color:'#fff', background:P }}>
                  Voir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}