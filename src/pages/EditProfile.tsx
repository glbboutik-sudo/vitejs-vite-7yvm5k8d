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
  const [coverUrl, setCoverUrl] = useState('')
  const [coverPreview, setCoverPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => { loadProfile() }, [])

  async function loadProfile() {
    setProfileLoading(true)
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
      setCoverUrl(data.cover_url || '')
      setCoverPreview(data.cover_url || '')
    }
    setProfileLoading(false)
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

  async function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setCoverPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
    setUploadingCover(true)
    const fileName = `cover-${user?.id}-${Date.now()}`
    const { error } = await supabase.storage.from('images').upload(fileName, file, { upsert: true })
    if (error) { alert('Erreur upload : ' + error.message); setUploadingCover(false); return }
    const { data } = supabase.storage.from('images').getPublicUrl(fileName)
    setCoverUrl(data.publicUrl)
    setUploadingCover(false)
  }

  async function saveProfile() {
    if (!fullName.trim()) { alert('Le nom est obligatoire'); return }
    setLoading(true)

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
      cover_url: coverUrl || null,
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
    : user?.email?.[0]?.toUpperCase() || '?'

  if (profileLoading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div style={{ fontSize:13, color:'#aaa' }}>Chargement du profil…</div>
    </div>
  )

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

        {/* IMAGE DE COUVERTURE */}
        <div style={card}>
          <div style={cardTtl}>🖼️ Image de couverture</div>
          <div style={{ position:'relative', height:100, borderRadius:10, overflow:'hidden', background:`linear-gradient(135deg,${P},#b03028)`, marginBottom:8 }}>
            {coverPreview && (
              <img src={coverPreview} alt="cover" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
            )}
            {uploadingCover && (
              <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.5)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:12, fontWeight:700 }}>
                Upload en cours…
              </div>
            )}
            <label style={{ position:'absolute', bottom:8, right:8, background:'rgba(0,0,0,.5)', color:'#fff', border:'none', borderRadius:20, padding:'4px 10px', fontSize:10, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
              📷 Changer
              <input type="file" accept="image/*" onChange={handleCover} style={{ display:'none' }}/>
            </label>
          </div>
          {!uploadingCover && coverUrl && <div style={{ fontSize:10, color:'#2E7D32', fontWeight:600 }}>✓ Image de couverture prête</div>}
        </div>

        {/* AVATAR */}
        <div style={card}>
          <div style={cardTtl}>📸 Photo de profil</div>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ position:'relative' }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:'#fff', border:`3px solid ${P}`, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:700, color:P }}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                ) : initials}
              </div>
              {uploading && (
                <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'rgba(0,0,0,.5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'#fff', fontWeight:700 }}>
                  Upload…
                </div>
              )}
              <label style={{ position:'absolute', bottom:0, right:0, width:22, height:22, background:P, borderRadius:'50%', border:'2px solid #fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, cursor:'pointer' }}>
                📷
                <input type="file" accept="image/*" onChange={handleAvatar} style={{ display:'none' }}/>
              </label>
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:'#111' }}>Photo de profil</div>
              <div style={{ fontSize:10, color:'#aaa', marginTop:2 }}>Appuyez sur 📷 pour changer</div>
              {!uploading && avatarUrl && <div style={{ fontSize:10, color:'#2E7D32', marginTop:3, fontWeight:600 }}>✓ Photo prête</div>}
            </div>
          </div>
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

        <button onClick={saveProfile} disabled={loading || uploading || uploadingCover} style={{ width:'100%', padding:13, background: loading||uploading||uploadingCover ? '#ccc' : P, color:'#fff', border:'none', borderRadius:20, fontSize:14, fontWeight:800, cursor: loading||uploading||uploadingCover ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Sauvegarde…' : uploading||uploadingCover ? 'Upload…' : '💾 Sauvegarder'}
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