import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

const P = '#D94F45'

export default function Item({ item, goBack, onSellerClick, onContactClick }: { item: any, goBack: () => void, onSellerClick?: (id: string) => void, onContactClick?: () => void }) {
  const [liked, setLiked] = useState(false)
  const [favorites, setFavorites] = useState(item.favorites || 0)

  useEffect(() => {
    async function addView() {
      await supabase.from('items').update({ views: (item.views || 0) + 1 }).eq('id', item.id)
    }
    addView()
    const liked = localStorage.getItem(`fav_${item.id}`)
    if (liked) setLiked(true)
  }, [item.id])

  async function toggleFavorite() {
    if (liked) {
      const newCount = Math.max(0, favorites - 1)
      setFavorites(newCount)
      setLiked(false)
      localStorage.removeItem(`fav_${item.id}`)
      await supabase.from('items').update({ favorites: newCount }).eq('id', item.id)
    } else {
      const newCount = favorites + 1
      setFavorites(newCount)
      setLiked(true)
      localStorage.setItem(`fav_${item.id}`, '1')
      await supabase.from('items').update({ favorites: newCount }).eq('id', item.id)
    }
  }

  return (
    <div style={{ paddingBottom:80, background:'#fafafa', minHeight:'100vh' }}>

      {/* HEADER */}
      <div style={{ background:'#fff', padding:'12px 14px', display:'flex', alignItems:'center', gap:10, borderBottom:'0.5px solid #f0eded', position:'sticky', top:0, zIndex:10 }}>
        <button onClick={goBack} style={{ width:32, height:32, borderRadius:'50%', background:'#f5f5f5', border:'none', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
        <div style={{ fontSize:14, fontWeight:700, color:'#111', flex:1 }}>Détail article</div>
        <button onClick={toggleFavorite} style={{ width:32, height:32, borderRadius:'50%', background: liked ? '#FDEDEC' : '#f5f5f5', border:'none', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>
          {liked ? '❤️' : '🤍'}
        </button>
      </div>

      {/* PHOTO */}
      <div style={{ height:260, background:'#FDEDEC', display:'flex', alignItems:'center', justifyContent:'center', fontSize:80, position:'relative', overflow:'hidden' }}>
        {item.image_url ? (
          <img src={item.image_url} alt={item.title} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
        ) : <span>{item.emoji || '📦'}</span>}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:P }}/>
        <div style={{ position:'absolute', top:12, right:12, background:'#fff', borderRadius:20, padding:'4px 10px', fontSize:10, fontWeight:700, color:'#2E7D32' }}>✓ Disponible</div>
        <div style={{ position:'absolute', bottom:12, left:12, display:'flex', gap:6 }}>
          <div style={{ background:'rgba(0,0,0,.5)', borderRadius:20, padding:'4px 10px', fontSize:10, fontWeight:600, color:'#fff' }}>👁 {(item.views||0)+1}</div>
          <div style={{ background:'rgba(0,0,0,.5)', borderRadius:20, padding:'4px 10px', fontSize:10, fontWeight:600, color:'#fff' }}>❤️ {favorites}</div>
        </div>
      </div>

      {/* INFOS */}
      <div style={{ padding:'14px 16px', background:'#fff', marginBottom:8 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
          <div style={{ fontSize:11, color:'#aaa', textTransform:'uppercase', letterSpacing:.5 }}>{item.category}</div>
          <button onClick={toggleFavorite} style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 12px', borderRadius:20, border:`1.5px solid ${liked?P:'#eee'}`, background: liked?'#FDEDEC':'#fff', cursor:'pointer', fontSize:11, fontWeight:700, color: liked?P:'#aaa' }}>
            {liked ? '❤️ Favori' : '🤍 Ajouter'}
          </button>
        </div>
        <div style={{ fontSize:18, fontWeight:800, color:'#111', marginBottom:8 }}>{item.title}</div>
        <div style={{ fontSize:26, fontWeight:800, color:P, marginBottom:8 }}>{item.price?.toLocaleString('fr-FR')} €</div>
        <div style={{ fontSize:12, color:'#888', lineHeight:1.6 }}>{item.description || 'Aucune description disponible.'}</div>
      </div>

      {/* VENDEUR */}
      <div style={{ padding:'12px 16px', background:'#fff', marginBottom:8, display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:42, height:42, borderRadius:'50%', background:P, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, color:'#fff', overflow:'hidden' }}>
          {item.emoji || '👤'}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#111' }}>Vendeur Kileer</div>
          <div style={{ fontSize:10, color:'#aaa', marginTop:2 }}>⭐ 4.9 · Vendeur vérifié ✓</div>
        </div>
        <button onClick={() => item.seller_id && onSellerClick?.(item.seller_id)} style={{ padding:'6px 14px', borderRadius:20, border:`1px solid ${P}`, background:'#fff', color:P, fontSize:11, fontWeight:700, cursor:'pointer' }}>
          Voir profil
        </button>
      </div>

      {/* DÉTAILS */}
      <div style={{ padding:'12px 16px', background:'#fff', marginBottom:8 }}>
        <div style={{ fontSize:12, fontWeight:700, color:'#111', marginBottom:10 }}>📋 Détails</div>
        {[
          ['Catégorie', item.category || '-'],
          ['État', 'Bon état'],
          ['Stock', `${item.stock || 1} disponible`],
          ['Vues', `${(item.views||0)+1}`],
          ['Favoris', `${favorites}`],
          ['Livraison', 'Colissimo 48h'],
          ['Retours', '14 jours'],
        ].map(([k,v]) => (
          <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'0.5px solid #f5f5f5', fontSize:12 }}>
            <span style={{ color:'#aaa' }}>{k}</span>
            <span style={{ fontWeight:600, color:'#111' }}>{v}</span>
          </div>
        ))}
      </div>

      {/* BOUTONS BAS */}
      <div style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:390, background:'#fff', borderTop:'0.5px solid #f0eded', padding:'10px 14px 20px', display:'flex', gap:8, zIndex:50 }}>
        <button onClick={toggleFavorite} style={{ width:44, padding:13, borderRadius:20, border:`1.5px solid ${liked?P:'#eee'}`, background: liked?'#FDEDEC':'#fff', color: liked?P:'#aaa', fontSize:18, cursor:'pointer' }}>
          {liked ? '❤️' : '🤍'}
        </button>
        <button onClick={onContactClick} style={{ flex:1, padding:13, borderRadius:20, border:`1.5px solid ${P}`, background:'#fff', color:P, fontSize:13, fontWeight:800, cursor:'pointer' }}>
          💬 Contacter
        </button>
        <button style={{ flex:2, padding:13, borderRadius:20, border:'none', background:P, color:'#fff', fontSize:13, fontWeight:800, cursor:'pointer' }}>
          🛒 Acheter — {item.price?.toLocaleString('fr-FR')} €
        </button>
      </div>

    </div>
  )
}