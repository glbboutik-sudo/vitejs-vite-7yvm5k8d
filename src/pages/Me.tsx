import { useState } from 'react'

const P = '#D94F45'

export default function Me({ goTab }: { goTab: (t: string) => void }) {
  const [privacy, setPrivacy] = useState('public')

  const privIcon  = privacy==='public' ? '🌍' : privacy==='abonnes' ? '👥' : '🔒'
  const privLabel = privacy==='public' ? 'Public' : privacy==='abonnes' ? 'Abonnés' : 'Privé'

  function togglePrivacy() {
    const opts = ['public','abonnes','prive']
    setPrivacy(opts[(opts.indexOf(privacy)+1) % 3])
  }

  return (
    <div style={{ paddingBottom:80 }}>

      {/* STATUS BAR */}
      <div style={{ background:P, padding:'7px 14px 3px', display:'flex', justifyContent:'space-between', fontSize:10, fontWeight:600, color:'#fff' }}>
        <span>9:41</span><span>▶ ⬛</span>
      </div>

      {/* COUVERTURE */}
      <div style={{ height:100, background:`linear-gradient(135deg,${P},#b03028)`, position:'relative' }}>
        <div style={{ position:'absolute', bottom:7, right:10, background:'rgba(0,0,0,.45)', border:'none', borderRadius:20, padding:'4px 10px', fontSize:10, fontWeight:600, color:'#fff', cursor:'pointer' }}>
          📷 Modifier
        </div>
        {/* AVATAR */}
        <div style={{ position:'absolute', bottom:-26, left:14 }}>
          <div style={{ width:52, height:52, borderRadius:'50%', background:'#fff', border:'3px solid #fff', boxShadow:'0 2px 8px rgba(0,0,0,.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700, color:P, cursor:'pointer', position:'relative' }}>
            JD
            <div style={{ position:'absolute', bottom:0, right:0, width:16, height:16, background:P, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, border:'2px solid #fff' }}>📷</div>
          </div>
        </div>
      </div>

      {/* INFOS */}
      <div style={{ padding:'30px 14px 10px', background:'#fafafa' }}>
        <div style={{ fontSize:15, fontWeight:800, color:'#111' }}>Jean Dupont</div>
        <div style={{ fontSize:10, color:'#aaa', marginTop:2 }}>@jeandupont · Membre 2024 · Vendeur ✓</div>
        <div onClick={togglePrivacy} style={{ display:'inline-flex', alignItems:'center', gap:4, background:'#FDEDEC', color:P, fontSize:10, fontWeight:600, padding:'3px 9px', borderRadius:20, marginTop:5, cursor:'pointer' }}>
          {privIcon} {privLabel} · Modifier →
        </div>
      </div>

      {/* STATS */}
      <div style={{ display:'flex', background:'#fff', border:'0.5px solid #f0eded', borderRadius:12, margin:'10px 14px', overflow:'hidden' }}>
        {[['5','Articles'],['0','Favoris'],['4.9','Note'],['332€','Revenus']].map(([n,l]) => (
          <div key={l} style={{ flex:1, padding:'9px 0', textAlign:'center', borderRight:'0.5px solid #f0eded' }}>
            <div style={{ fontSize:14, fontWeight:800, color:P }}>{n}</div>
            <div style={{ fontSize:9, color:'#bbb' }}>{l}</div>
          </div>
        ))}
      </div>

      {/* MENU */}
      <div style={{ padding:'0 14px' }}>
        {[
          { ico:'🌍', lbl:'Mon profil public',  sub:'Voir comme vos visiteurs',   action: ()=>{} },
          { ico:'📦', lbl:'Mes ventes',          sub:'2 en cours',                 action: ()=>goTab('sell') },
          { ico:'📅', lbl:'Mes lives',           sub:'2 programmés',              action: ()=>goTab('sell') },
          { ico:'🎟️', lbl:'Coupons',             sub:'3 actifs',                  action: ()=>goTab('sell') },
          { ico:'🎁', lbl:'Parrainage',          sub:'15€ gagnés',                action: ()=>goTab('sell') },
          { ico:'💬', lbl:'Messages',            sub:'3 non lus',                 action: ()=>{} },
          { ico:'🔒', lbl:'Confidentialité',     sub:privLabel,                   action: togglePrivacy },
          { ico:'⚙️', lbl:'Paramètres',          sub:'Compte & sécurité',         action: ()=>{} },
        ].map((item, i) => (
          <div key={i} onClick={item.action} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'#fff', border:'0.5px solid #f0eded', borderRadius:11, marginBottom:7, cursor:'pointer' }}>
            <div style={{ width:30, height:30, borderRadius:7, background:'#FDEDEC', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>{item.ico}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, fontWeight:600, color:'#111' }}>{item.lbl}</div>
              <div style={{ fontSize:10, color:'#bbb', marginTop:1 }}>{item.sub}</div>
            </div>
            <span style={{ color:'#eee', fontSize:16 }}>›</span>
          </div>
        ))}
      </div>

    </div>
  )
}