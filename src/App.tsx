import { useState, useEffect } from 'react'
import './App.css'
import { supabase } from './supabase'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Live from './pages/Live'
import Express from './pages/Express'
import Sell from './pages/Sell'
import Me from './pages/Me'

function App() {
  const [tab, setTab] = useState('home')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    // Écouter les changements de connexion
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#D94F45' }}>
      <div style={{ fontSize:36, fontWeight:800, color:'#fff' }}>Kileer</div>
    </div>
  )

  if (!user) return (
    <div className="app">
      <Auth onLogin={() => setUser(true)} />
    </div>
  )

  return (
    <div className="app">

      {tab === 'live'    && <Live    goTab={setTab} />}
      {tab === 'express' && <Express goTab={setTab} />}

      <div className="page" style={{ display: tab==='live' || tab==='express' ? 'none' : 'block' }}>
        {tab === 'home' && <Home goTab={setTab} />}
        {tab === 'sell' && <Sell goTab={setTab} />}
        {tab === 'me'   && <Me   goTab={setTab} />}
      </div>

      {tab !== 'live' && tab !== 'express' && (
        <nav className="tabbar">
          <button className={tab==='home' ? 'on' : ''} onClick={()=>setTab('home')}>
            <span className="ico">🏠</span><span>Accueil</span>
          </button>
          <button className={tab==='live' ? 'on' : ''} onClick={()=>setTab('live')}>
            <span className="ico">📡</span><span>Live</span>
          </button>
          <button className="sell-btn" onClick={()=>setTab('sell')}>
            <div className="sell-ico">＋</div>
            <span>Vendre</span>
          </button>
          <button className={tab==='express' ? 'on' : ''} onClick={()=>setTab('express')}>
            <span className="ico">⚡</span><span>Express</span>
          </button>
          <button className={tab==='me' ? 'on' : ''} onClick={()=>setTab('me')}>
            <span className="ico">👤</span><span>Moi</span>
          </button>
        </nav>
      )}

    </div>
  )
}

export default App