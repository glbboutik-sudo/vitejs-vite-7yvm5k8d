const P = '#D94F45'

export default function Item({ item, goBack }: { item: any, goBack: () => void }) {
  return (
    <div style={{ paddingBottom:80, background:'#fafafa', minHeight:'100vh' }}>

      {/* HEADER */}
      <div style={{ background:'#fff', padding:'12px 14px', display:'flex', alignItems:'center', gap:10, borderBottom:'0.5px solid #f0eded', position:'sticky', top:0, zIndex:10 }}>
        <button onClick={goBack} style={{ width:32, height:32, borderRadius:'50%', background:'#f5f5f5', border:'none', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
        <div style={{ fontSize:14, fontWeight:700, color:'#111' }}>Détail article</div>
      </div>

      {/* PHOTO */}
      <div style={{ height:260, background:'#FDEDEC', display:'flex', alignItems:'center', justifyContent:'center', fontSize:80, position:'relative' }}>
        {item.emoji || '📦'}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:P }}/>
        <div style={{ position:'absolute', top:12, right:12, background:'#fff', borderRadius:20, padding:'4px 10px', fontSize:10, fontWeight:700, color:'#2E7D32' }}>
          ✓ Disponible
        </div>
      </div>

      {/* INFOS */}
      <div style={{ padding:'14px 16px', background:'#fff', marginBottom:8 }}>
        <div style={{ fontSize:11, color:'#aaa', marginBottom:4, textTransform:'uppercase', letterSpacing:.5 }}>{item.category}</div>
        <div style={{ fontSize:18, fontWeight:800, color:'#111', marginBottom:8 }}>{item.title}</div>
        <div style={{ fontSize:26, fontWeight:800, color:P, marginBottom:8 }}>{item.price?.toLocaleString('fr-FR')} €</div>
        <div style={{ fontSize:12, color:'#888', lineHeight:1.6 }}>{item.description || 'Aucune description disponible.'}</div>
      </div>

      {/* VENDEUR */}
      <div style={{ padding:'12px 16px', background:'#fff', marginBottom:8, display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:42, height:42, borderRadius:'50%', background:P, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, color:'#fff' }}>
          {item.emoji || '👤'}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#111' }}>Vendeur Kileer</div>
          <div style={{ fontSize:10, color:'#aaa', marginTop:2 }}>⭐ 4.9 · Vendeur vérifié ✓</div>
        </div>
        <button style={{ padding:'6px 14px', borderRadius:20, border:`1px solid ${P}`, background:'#fff', color:P, fontSize:11, fontWeight:700, cursor:'pointer' }}>
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
          ['Livraison', 'Colissimo 48h'],
          ['Retours', '14 jours'],
        ].map(([k,v]) => (
          <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'0.5px solid #f5f5f5', fontSize:12 }}>
            <span style={{ color:'#aaa' }}>{k}</span>
            <span style={{ fontWeight:600, color:'#111' }}>{v}</span>
          </div>
        ))}
      </div>

      {/* BOUTONS FIXES EN BAS */}
      <div style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:390, background:'#fff', borderTop:'0.5px solid #f0eded', padding:'10px 14px 20px', display:'flex', gap:8, zIndex:50 }}>
        <button style={{ flex:1, padding:13, borderRadius:20, border:`1.5px solid ${P}`, background:'#fff', color:P, fontSize:13, fontWeight:800, cursor:'pointer' }}>
          💬 Contacter
        </button>
        <button style={{ flex:2, padding:13, borderRadius:20, border:'none', background:P, color:'#fff', fontSize:13, fontWeight:800, cursor:'pointer' }}>
          🛒 Acheter — {item.price?.toLocaleString('fr-FR')} €
        </button>
      </div>

    </div>
  )
}