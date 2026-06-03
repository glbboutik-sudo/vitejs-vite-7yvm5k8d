import { useState } from 'react'
import { supabase } from '../supabase'

const P = '#D94F45'

export default function Auth({ onLogin }: { onLogin: () => void }) {
  const [mode, setMode] = useState<'login'|'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit() {
    setLoading(true)
    setError('')
    setSuccess('')

    if (mode === 'signup') {
      // Vérifier si le pseudo est déjà pris
      if (username) {
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', username.toLowerCase())
          .single()
        if (existing) {
          setError('Ce pseudo est déjà pris, choisissez-en un autre')
          setLoading(false)
          return
        }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name, username: username.toLowerCase() } }
      })

      if (error) {
        setError(error.message)
      } else if (data.user) {
        // Mettre à jour le profil avec le username
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: name,
          username: username.toLowerCase(),
        })
        setSuccess('Compte créé ! Vérifiez votre email puis connectez-vous.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('Email ou mot de passe incorrect')
      else onLogin()
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#fafafa', display:'flex', flexDirection:'column' }}>

      {/* HEADER */}
      <div style={{ background:P, padding:'40px 30px 30px', textAlign:'center' }}>
        <div style={{ fontSize:36, fontWeight:800, color:'#fff', letterSpacing:-1 }}>Kileer</div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,.75)', marginTop:6 }}>
          {mode==='login' ? 'Connectez-vous à votre compte' : 'Créez votre compte gratuit'}
        </div>
      </div>

      {/* FORM */}
      <div style={{ flex:1, padding:'30px 24px' }}>

        {/* TOGGLE */}
        <div style={{ display:'flex', background:'#f0f0f0', borderRadius:12, padding:3, marginBottom:24 }}>
          {(['login','signup'] as const).map(m => (
            <button key={m} onClick={()=>{setMode(m);setError('');setSuccess('')}} style={{ flex:1, padding:'8px 0', borderRadius:10, border:'none', cursor:'pointer', fontSize:13, fontWeight:700, background: mode===m ? '#fff' : 'transparent', color: mode===m ? P : '#aaa', boxShadow: mode===m ? '0 1px 4px rgba(0,0,0,.1)' : 'none', transition:'all .2s' }}>
              {m==='login' ? 'Connexion' : 'Inscription'}
            </button>
          ))}
        </div>

        {/* CHAMPS INSCRIPTION */}
        {mode==='signup' && (
          <>
            <div style={{ marginBottom:14 }}>
              <label style={lbl}>Nom complet</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Ex : Jean Dupont" style={inp}/>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={lbl}>Pseudo</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:13, color:'#aaa' }}>@</span>
                <input
                  value={username}
                  onChange={e=>setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g,'').toLowerCase())}
                  placeholder="votre_pseudo"
                  style={{ ...inp, paddingLeft:26 }}
                />
              </div>
              <div style={{ fontSize:9, color:'#aaa', marginTop:3 }}>Lettres, chiffres et _ uniquement</div>
            </div>
          </>
        )}

        <div style={{ marginBottom:14 }}>
          <label style={lbl}>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="votre@email.com" style={inp}/>
        </div>

        <div style={{ marginBottom:24 }}>
          <label style={lbl}>Mot de passe</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" style={inp}/>
        </div>

        {/* ERREUR / SUCCÈS */}
        {error   && <div style={{ background:'#FDEDEC', color:P, fontSize:12, padding:'10px 14px', borderRadius:10, marginBottom:14, fontWeight:600 }}>⚠️ {error}</div>}
        {success && <div style={{ background:'#E8F5E9', color:'#2E7D32', fontSize:12, padding:'10px 14px', borderRadius:10, marginBottom:14, fontWeight:600 }}>✅ {success}</div>}

        {/* BOUTON */}
        <button onClick={handleSubmit} disabled={loading} style={{ width:'100%', padding:14, background: loading ? '#ccc' : P, color:'#fff', border:'none', borderRadius:20, fontSize:14, fontWeight:800, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Chargement…' : mode==='login' ? 'Se connecter' : "S'inscrire"}
        </button>

        {/* SÉPARATEUR */}
        <div style={{ display:'flex', alignItems:'center', gap:10, margin:'20px 0' }}>
          <div style={{ flex:1, height:1, background:'#f0f0f0' }}/>
          <span style={{ fontSize:11, color:'#bbb' }}>ou</span>
          <div style={{ flex:1, height:1, background:'#f0f0f0' }}/>
        </div>

        <div style={{ textAlign:'center', fontSize:12, color:'#aaa' }}>
          {mode==='login' ? "Pas encore de compte ? " : "Déjà un compte ? "}
          <span onClick={()=>{setMode(mode==='login'?'signup':'login');setError('');setSuccess('')}} style={{ color:P, fontWeight:700, cursor:'pointer' }}>
            {mode==='login' ? "S'inscrire" : 'Se connecter'}
          </span>
        </div>

      </div>
    </div>
  )
}

const lbl: React.CSSProperties = { display:'block', fontSize:11, fontWeight:600, color:'#666', marginBottom:6 }
const inp: React.CSSProperties = { width:'100%', background:'#fff', border:'1px solid #e8e8e8', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#222', outline:'none', boxShadow:'0 1px 3px rgba(0,0,0,.05)' }