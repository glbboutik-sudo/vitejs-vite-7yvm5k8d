import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

const P = '#D94F45'

export default function EditProfile({ goBack }: { goBack: () => void }) {
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarPreview, setAvatarPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => { loadProfile() }, [])

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUser(user)
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (data) {
      setFullName(data.full_name || '')
      setUsername(data.username || '')
      setBio(data.bio || '')
      setAvatarUrl(data.avatar_url || '')
      setAvatarPreview(data.avatar_url || '')
    }
  }

  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
    setUploading(true)
    const fileName = `avatar-${user?.id}-${Date.now()}`
    const { error } = await supabase.storage.from('images').upload(fileName, file, { upsert: true })
    if (error) { alert('Erreur upload : ' + error.message); setUploading(false); return }
    const { data } = supabase.storage.from('images').getPublicUrl(fileName)
    setAvatarUrl(data.publicUrl)
    setUploading(false)
  }

  async function saveProfile() {
    if (!fullName.trim()) { alert('Le nom est obligatoire'); return }
    setLoading(true)

    // Vérifier pseudo unique
    if (username) {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username.toLowerCase())
        .neq('id', user?.id)
        .single()
      if (existing) { alert('Ce pseudo est déjà pris'); setLoading(false); return }
    }

    const { error } = await supabase.from('profiles').update({
      full_name: fullName.trim(),
      username: username.toLowerCase().trim(),
      bio: bio.trim(),
      avatar_url: avatarUrl || null,
    }).eq('id', user?.id)

    setLoading(false)
    if (error) { alert('Erreur : ' + error.message) }
    else {
      setSuccess(true)
      setTimeout(() => { setSuccess(false); goBack() }, 1500)
    }
  }

  const initials = fullName
    ? fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
    : '?'

  return (
    <div style={{ paddingBottom:80, background:'#fafafa', minHeight:'100vh' }}>

      {/* HEADER */}
      <div style={{ background:P, padding:'12px 14px 14px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button onClick={goBack} style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,.2)', border:'none', cursor:'pointer', fontSize:16, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
          <div style={{ fontSize:16, fontWeight:800, color:'#fff' }}>Modifier mon profil</div>
        </div>
      </div>

      <div style={{ padding:'16px 14px' }}>

        {/* AVATAR */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:20 }}>
          <div style={{ position:'relative', marginBottom:10 }}>
            <div style={{ width:80, height:80, borderRadius:'50%', background:'#fff', border:`3px solid ${P}`, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, fontWeight:700, color:P }}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
              ) : initials}
            </div>
            {uploading && (
              <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'rgba(0,0,0,.5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#fff', fontWeight:700 }}>
                Upload…
              </div>
            )}
            <label style={{ position:'absolute', bottom:0, right:0, width:26, height:26, background:P, borderRadius:'50%', border:'2px solid #fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, cursor:'pointer' }}>
              📷
              <input type="file" accept="image/*" onChange={handleAvatar} style={{ display:'none' }}/>
            </label>
          </div>
          <div style={{ fontSize:11, color:'#aaa' }}>Appuyez sur 📷 pour changer la photo</div>
        </div>

        {/* FORMULAIRE */}
        <div style={card}>
          <div style={cardTtl}>👤 Informations personnelles</div>

          <div style={fl}>
            <label style={lbl}>Nom complet *</label>
            <input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Ex : Jean Dupont" style={inp}/>
          </div>

          <div style={fl}>
            <label style={lbl}>Pseudo</label>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', fontSize:13, color:'#aaa' }}>@</span>
              <input
                value={username}
                onChange={e=>setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g,'').toLowerCase())}
                placeholder="votre_pseudo"
                style={{ ...inp, paddingLeft:24 }}
              />
            </div>
            <div style={{ fontSize:9, color:'#aaa', marginTop:3 }}>Lettres, chiffres et _ uniquement</div>
          </div>

          <div style={fl}>
            <label style={lbl}>Bio</label>
            <textarea
              value={bio}
              onChange={e=>setBio(e.target.value)}
              placeholder="Décrivez-vous en quelques mots…"
              maxLength={150}
              style={{ ...inp, height:70, resize:'none' } as React.CSSProperties}
            />
            <div style={{ fontSize:9, color:'#aaa', marginTop:3, textAlign:'right' }}>{bio.length}/150</div>
          </div>
        </div>

        {success && (
          <div style={{ background:'#E8F5E9', color:'#2E7D32', padding:'10px 14px', borderRadius:12, textAlign:'center', fontWeight:700, fontSize:13, marginBottom:10 }}>
            ✅ Profil mis à jour !
          </div>
        )}

        <button onClick={saveProfile} disabled={loading || uploading} style={{ width:'100%', padding:13, background: loading||uploading ? '#ccc' : P, color:'#fff', border:'none', borderRadius:20, fontSize:14, fontWeight:800, cursor: loading||uploading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Sauvegarde…' : '💾 Sauvegarder'}
        </button>

      </div>
    </div>
  )
}

const card: React.CSSProperties = { background:'#fff', border:'0.5px solid #f0eded', borderRadius:12, padding:13, marginBottom:12 }
const cardTtl: React.CSSProperties = { fontSize:12, fontWeight:700, color:'#111', marginBottom:12 }
const fl: React.CSSProperties = { marginBottom:12 }
const lbl: React.CSSProperties = { display:'block', fontSize:10, fontWeight:600, color:'#666', marginBottom:5 }
const inp: React.CSSProperties = { width:'100%', background:'#fafafa', border:'1px solid #e8e8e8', borderRadius:10, padding:'10px 12px', fontSize:12, color:'#222', outline:'none' }