import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

const P = '#D94F45'

export default function Me({ goTab, onEditProfile }: { goTab: (t: string) => void, onEditProfile: () => void }) {
  const [profile, setProfile] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ articles: 0, vues: 0, favoris: 0 })
  const [loading, setLoading] = useState(true)
  const [privacy, setPrivacy] = useState('public')

  useEffect(() => {
    loadProfile()
    // Recharger quand on revient sur la page
    const handler = () => loadProfile()
    window.addEventListener('focus', handler)
    return () => window.removeEventListener('focus', handler)
  }, [])

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUser(user)
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (profile) { setProfile(profile); setPrivacy(profile.privacy || 'public') }
    const { data: items } = await supabase.from('items').select('views, favorites').eq('seller_id', user.id)
    if (items) setStats({
      articles: items.length,
      vues: items.reduce((s,i) => s+(i.views||0),0),
      favoris: items.reduce((s,i) => s+(i.favorites||0),0)
    })
    setLoading(false)
  }

  async function updatePrivacy(newPrivacy: string) {
    setPrivacy(newPrivacy)
    await supabase.from('profiles').update({ privacy: newPrivacy }).eq('id', user?.id)
  }

  function togglePrivacy() {
    const opts = ['public','abonnes','prive']
    updatePrivacy(opts[(opts.indexOf(privacy)+1) % 3])
  }

  async function toggleShowRealName() {
    const newVal = !profile?.show_real_name
    setProfile({...profile, show_real_name: newVal})
    await supabase.from('profiles').update({ show_real_name: newVal }).eq('id', user?.id)
  }

  const privIcon    = privacy==='public' ? '🌍' : privacy==='abonnes' ? '👥' : '🔒'
  const privLabel   = privacy==='public' ? 'Public' : privacy==='abonnes' ? 'Abonnés' : 'Privé'
  const initials    = profile?.full_name ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0,2) : user?.email?.[0]?.toUpperCase() || '?'
  const displayName = profile?.username ? `@${profile.username}` : profile?.full_name || user?.email || 'Mon profil'
  const realName    = profile?.show_real_name !== false ? profile?.full_name : '·····'

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div style={{ fontSize:13, color:'#aaa' }}>Chargement…</div>
    </div>
  )

  return (
    <div style={{ paddingBottom:80 }}>

      {/* COUVERTURE */}
      <div style={{ height:110, background:`linear-gradient(135deg,${P},#b03028)`, position:'relative' }}>
        <button onClick={onEditProfile} style={{ position:'absolute', bottom:7, right:10, background:'rgba(0,0,0,.45)', border:'none', borderRadius:20, padding:'4px 10px', fontSize:10, fontWeight:600, color:'#fff', cursor:'pointer' }}>
          📷 Modifier
        </button>
        <div style={{ position:'absolute', bottom:-26, left:14 }}>
          <div onClick={onEditProfile} style={{ width:52, height:52, borderRadius:'50%', background:'#fff', border:'3px solid #fff', boxShadow:'0 2px 8px rgba(0,0,0,.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700, color:P, cursor:'pointer', position:'relative', overflow:'hidden' }}>
            {profile?.avatar_url ? <img src={profile.avatar_url} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : initials}
            <div style={{ position:'absolute', bottom:0, right:0, width:16, height:16, background:P, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, border:'2px solid #fff' }}>📷</div>
          </div>
        </div>
      </div>

      {/* INFOS */}
      <div style={{ padding:'32px 14px 10px', background:'#fafafa' }}>
        <div style={{ fontSize:16, fontWeight:800, color:'#111' }}>{displayName}</div>
        {profile?.username && profile?.full_name && (
          <div style={{ fontSize:10, color:'#aaa', marginTop:2 }}>
            {realName} · Membre depuis {new Date(user?.created_at || '').toLocaleDateString('fr-FR', { month:'long', year:'numeric' })}
          </div>
        )}
        {profile?.bio && <div style={{ fontSize:11, color:'#555', marginTop:5, lineHeight:1.5 }}>{profile.bio}</div>}
        <div style={{ display:'flex', gap:6, marginTop:8, flexWrap:'wrap' }}>
          <div onClick={togglePrivacy} style={{ display:'inline-flex', alignItems:'center', gap:4, background:'#FDEDEC', color:P, fontSize:10, fontWeight:600, padding:'4px 10px', borderRadius:20, cursor:'pointer' }}>
            {privIcon} {privLabel} →
          </div>
          <div onClick={toggleShowRealName} style={{ display:'inline-flex', alignItems:'center', gap:4, background: profile?.show_real_name !== false ? '#E8F5E9' : '#f5f5f5', color: profile?.show_real_name !== false ? '#2E7D32' : '#999', fontSize:10, fontWeight:600, padding:'4px 10px', borderRadius:20, cursor:'pointer' }}>
            {profile?.show_real_name !== false ? '👁 Nom visible' : '🔒 Nom masqué'}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display:'flex', background:'#fff', border:'0.5px solid #f0eded', borderRadius:12, margin:'10px 14px', overflow:'hidden' }}>
        {[[String(stats.articles),'Articles'],[String(stats.vues),'Vues'],[String(stats.favoris),'Favoris'],['⭐ -','Note']].map(([n,l]) => (
          <div key={l} style={{ flex:1, padding:'9px 0', textAlign:'center', borderRight:'0.5px solid #f0eded' }}>
            <div style={{ fontSize:14, fontWeight:800, color:P }}>{n}</div>
            <div style={{ fontSize:9, color:'#bbb' }}>{l}</div>
          </div>
        ))}
      </div>

      {/* MENU */}
      <div style={{ padding:'0 14px' }}>
        {[
          { ico:'📦', lbl:'Mes annonces',   sub:`${stats.articles} article${stats.articles>1?'s':''}`, action: ()=>goTab('sell') },
          { ico:'📅', lbl:'Mes lives',       sub:'Programmer un live',                                  action: ()=>goTab('sell') },
          { ico:'🎟️', lbl:'Coupons',         sub:'Gérer mes coupons',                                   action: ()=>goTab('sell') },
          { ico:'🎁', lbl:'Parrainage',      sub:'Invitez vos amis',                                    action: ()=>goTab('sell') },
          { ico:'💬', lbl:'Messages',        sub:'Vos conversations',                                   action: ()=>{} },
          { ico:'✏️', lbl:'Modifier profil', sub:'Nom, pseudo, bio, photo',                             action: onEditProfile },
          { ico:'🔒', lbl:'Confidentialité', sub:privLabel,                                             action: togglePrivacy },
          { ico:'⚙️', lbl:'Paramètres',      sub:'Compte & sécurité',                                   action: ()=>{} },
          { ico:'🚪', lbl:'Se déconnecter',  sub:'',                                                    action: async ()=>{ await supabase.auth.signOut() } },
        ].map((item, i) => (
          <div key={i} onClick={item.action} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'#fff', border:'0.5px solid #f0eded', borderRadius:11, marginBottom:7, cursor:'pointer' }}>
            <div style={{ width:30, height:30, borderRadius:7, background: item.lbl==='Se déconnecter' ? '#FDEDEC' : '#f5f5f5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>{item.ico}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, fontWeight:600, color: item.lbl==='Se déconnecter' ? P : '#111' }}>{item.lbl}</div>
              {item.sub && <div style={{ fontSize:10, color:'#bbb', marginTop:1 }}>{item.sub}</div>}
            </div>
            <span style={{ color:'#eee', fontSize:16 }}>›</span>
          </div>
        ))}
      </div>

    </div>
  )
}