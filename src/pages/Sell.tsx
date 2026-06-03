import { useState } from 'react'
import { supabase } from '../supabase'

const P = '#D94F45'

const emojiMap: Record<string, string> = {
  art: '🎨',
  mode: '👜',
  tech: '💻',
  deco: '🪑',
  musique: '🎸',
}

export default function Sell({ goTab }: { goTab: (t: string) => void }) {
  const [onglet, setOnglet] = useState('depot')
  const [selD, setSelD] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const tabs = [
    { k:'depot',      l:'+ Déposer' },
    { k:'lives',      l:'📅 Lives' },
    { k:'coupons',    l:'🎟️ Coupons' },
    { k:'parrainage', l:'🎁 Parrainage' },
    { k:'ventes',     l:'Ventes' },
    { k:'revenus',    l:'Revenus' },
  ]

  async function publier() {
    const titleEl    = document.getElementById('titre')       as HTMLInputElement
    const prixEl     = document.getElementById('prix')        as HTMLInputElement
    const categorieEl= document.getElementById('categorie')   as HTMLSelectElement
    const descEl     = document.getElementById('desc')        as HTMLTextAreaElement

    const title    = titleEl?.value?.trim()
    const price    = parseFloat(prixEl?.value)
    const category = categorieEl?.value
    const desc     = descEl?.value?.trim()

    if (!title)           { alert('Ajoutez un titre');       return }
    if (!price || price <= 0) { alert('Ajoutez un prix valide'); return }

    setLoading(true)
    const { error } = await supabase.from('items').insert({
      title,
      description: desc || '',
      price,
      category,
      emoji: emojiMap[category] || '📦',
      stock: 1,
      status: 'active',
      type: selD || 'fixed',
    })
    setLoading(false)

    if (error) {
      alert('Erreur : ' + error.message)
    } else {
      setSuccess(true)
      setTimeout(() => { setSuccess(false); setOnglet('ventes') }, 2000)
    }
  }

  return (
    <div style={{ paddingBottom:80 }}>

      {/* HEADER */}
      <div style={{ background:`linear-gradient(135deg,${P},#b03028)`, padding:'14px 16px 18px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'#fff', marginBottom:8 }}>
          <span>9:41</span><span>▶ ⬛</span>
        </div>
        <h2 style={{ fontSize:16, fontWeight:800, color:'#fff', marginBottom:3 }}>Mon espace vendeur</h2>
        <p style={{ fontSize:11, color:'rgba(255,255,255,.75)' }}>Gérez vos articles et revenus</p>
        <div style={{ display:'flex', gap:8, marginTop:10 }}>
          {[['2','En cours'],['332€','Ce mois'],['4.9⭐','Note']].map(([n,l]) => (
            <div key={l} style={{ flex:1, background:'rgba(255,255,255,.15)', borderRadius:10, padding:8, textAlign:'center' }}>
              <div style={{ fontSize:15, fontWeight:800, color:'#fff' }}>{n}</div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,.7)', marginTop:1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ONGLETS */}
      <div style={{ display:'flex', background:'#fff', borderBottom:'0.5px solid #f0eded', overflowX:'auto' }}>
        {tabs.map(t => (
          <button key={t.k} onClick={()=>setOnglet(t.k)} style={{ flexShrink:0, padding:'9px 12px', fontSize:10, fontWeight:600, border:'none', background:'transparent', cursor:'pointer', borderBottom: onglet===t.k ? `2px solid ${P}` : '2px solid transparent', color: onglet===t.k ? P : '#aaa', whiteSpace:'nowrap' }}>
            {t.l}
          </button>
        ))}
      </div>

      {/* CONTENU */}
      <div style={{ padding:'12px 14px' }}>

        {/* DÉPOSER */}
        {onglet==='depot' && (
          <div>
            <div style={card}>
              <div style={cardTtl}>📸 Photos & titre</div>
              <div style={{ display:'flex', gap:8, marginBottom:8 }}>
                {[['📷','Caméra'],['🖼️','Galerie']].map(([ico,lbl]) => (
                  <label key={lbl} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'10px 6px', borderRadius:10, border:'1.5px dashed #F5A49F', background:'#FDEDEC', cursor:'pointer' }}>
                    <span style={{ fontSize:18 }}>{ico}</span>
                    <span style={{ fontSize:9, fontWeight:600, color:'#A83228' }}>{lbl}</span>
                    <input type="file" accept="image/*" style={{ display:'none' }}/>
                  </label>
                ))}
              </div>
              <div style={fl}>
                <label style={lbl}>Titre</label>
                <input id="titre" placeholder="Ex : Nike Air Max 90" style={inp}/>
              </div>
              <div style={fl}>
                <label style={lbl}>Description</label>
                <textarea id="desc" placeholder="Décrivez votre article…" style={{ ...inp, height:48, resize:'none' } as React.CSSProperties}/>
              </div>
            </div>

            <div style={card}>
              <div style={cardTtl}>🏷️ Catégorie & prix</div>
              <div style={fl}>
                <label style={lbl}>Catégorie</label>
                <select id="categorie" style={inp}>
                  <option value="art">🎨 Art</option>
                  <option value="mode">👜 Mode</option>
                  <option value="tech">💻 Tech</option>
                  <option value="deco">🪑 Déco</option>
                  <option value="musique">🎸 Musique</option>
                </select>
              </div>
              <div style={fl}>
                <label style={lbl}>Prix (€)</label>
                <input id="prix" type="number" placeholder="Ex : 50" min="1" style={inp}/>
              </div>
            </div>

            <div style={card}>
              <div style={cardTtl}>📦 Type de vente</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
                {[['fixed','🏷️','Prix fixe'],['express','⚡','Express'],['live','📡','Live']].map(([type,ico,label]) => (
                  <button key={type} onClick={()=>setSelD(type)} style={{ padding:'8px 4px', borderRadius:10, border:`1.5px solid ${selD===type ? P : '#eedede'}`, background: selD===type ? '#FDEDEC' : '#fafafa', fontSize:9, fontWeight:600, color: selD===type ? '#A83228' : '#999', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
                    <span style={{ fontSize:16 }}>{ico}</span>{label}
                  </button>
                ))}
              </div>
            </div>

            {success && (
              <div style={{ background:'#E8F5E9', color:'#2E7D32', padding:'10px 14px', borderRadius:12, textAlign:'center', fontWeight:700, fontSize:13, marginBottom:10 }}>
                ✅ Article publié avec succès !
              </div>
            )}

            <button
              onClick={publier}
              disabled={loading}
              style={{ width:'100%', padding:11, background: loading ? '#ccc' : P, color:'#fff', border:'none', borderRadius:20, fontSize:13, fontWeight:800, cursor: loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}
            >
              {loading ? 'Publication…' : '🚀 Publier l\'article'}
            </button>
          </div>
        )}

        {/* LIVES */}
        {onglet==='lives' && (
          <div>
            <button onClick={()=>goTab('live')} style={{ width:'100%', padding:11, background:P, color:'#fff', border:'none', borderRadius:12, fontSize:12, fontWeight:800, cursor:'pointer', marginBottom:12 }}>
              📅 Programmer un live
            </button>
            {[
              { emoji:'🎸', title:'Vente instruments vintage', date:'Sam 31 mai · 20h00', live:false },
              { emoji:'💻', title:'Tech & gadgets',            date:"Aujourd'hui · 18h00", live:true  },
            ].map((l,i) => (
              <div key={i} style={{ background:'#111', borderRadius:12, padding:'10px 12px', display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:`linear-gradient(135deg,${P},#b03028)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>{l.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'#fff' }}>{l.title}</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,.55)', marginTop:2 }}>📅 {l.date}</div>
                  <span style={{ fontSize:9, padding:'2px 7px', borderRadius:10, fontWeight:600, display:'inline-block', marginTop:3, background: l.live?'#FDEDEC':'#FFF3E0', color: l.live?P:'#E65100' }}>
                    {l.live ? '● En direct' : '⏳ Programmé'}
                  </span>
                </div>
                <button onClick={()=>goTab('live')} style={{ padding:'5px 10px', background:P, border:'none', borderRadius:20, fontSize:10, fontWeight:700, color:'#fff', cursor:'pointer' }}>
                  {l.live ? 'Rejoindre' : 'Modifier'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* COUPONS */}
        {onglet==='coupons' && (
          <div>
            <button style={{ width:'100%', padding:11, background:P, color:'#fff', border:'none', borderRadius:12, fontSize:12, fontWeight:800, cursor:'pointer', marginBottom:12 }}>
              🎟️ Créer un coupon
            </button>
            {[
              { code:'KILEER10', desc:'10% sur tout', uses:'47/100', discount:'10%' },
              { code:'BIENVENUE5', desc:'5€ offerts', uses:'23/50', discount:'5€' },
            ].map((c,i) => (
              <div key={i} style={{ background:'#fff', border:'0.5px solid #f0eded', borderRadius:12, padding:'10px 12px', marginBottom:8, borderLeft:`4px solid ${P}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:800, color:P, letterSpacing:1 }}>{c.code}</div>
                    <div style={{ fontSize:10, color:'#aaa', marginTop:2 }}>{c.desc} · {c.uses} util.</div>
                  </div>
                  <div style={{ fontSize:20, fontWeight:800, color:P }}>{c.discount}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PARRAINAGE */}
        {onglet==='parrainage' && (
          <div>
            <div style={{ background:'linear-gradient(135deg,#1a0a08,#3a0f0a)', borderRadius:12, padding:16, marginBottom:12, textAlign:'center' }}>
              <div style={{ fontSize:15, fontWeight:800, color:'#fff', marginBottom:4 }}>🎁 Parrainez & gagnez</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,.65)' }}>5€ offerts pour vous et votre filleul</div>
              <div style={{ background:'rgba(255,255,255,.1)', borderRadius:10, padding:12, marginTop:10, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ fontSize:18, fontWeight:800, color:'#fff', letterSpacing:2 }}>KILEER-JD47</div>
                <button style={{ padding:'7px 14px', background:P, border:'none', borderRadius:20, fontSize:11, fontWeight:700, color:'#fff', cursor:'pointer' }}>Copier 📋</button>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:12 }}>
              {[['3','Parrainés'],['15€','Gagnés'],['5€','En attente']].map(([n,l]) => (
                <div key={l} style={{ background:'#fff', border:'0.5px solid #f0eded', borderRadius:12, padding:10, textAlign:'center' }}>
                  <div style={{ fontSize:18, fontWeight:800, color:P }}>{n}</div>
                  <div style={{ fontSize:9, color:'#aaa' }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ background:'#fff', border:'0.5px solid #f0eded', borderRadius:12, padding:12 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#111', marginBottom:8 }}>Mes filleuls</div>
              {[
                { name:'Sophie Martin', date:'Il y a 2 jours', color:'#D94F45' },
                { name:'Lucas Dupont',  date:'Il y a 5 jours', color:'#e6732a' },
                { name:'Marie Petit',   date:'Il y a 2 sem.',  color:'#7c3aed' },
              ].map((f,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 0', borderBottom:'0.5px solid #f5f0f0' }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background:f.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#fff' }}>{f.name[0]}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:'#111' }}>{f.name}</div>
                    <div style={{ fontSize:10, color:'#aaa' }}>{f.date}</div>
                  </div>
                  <div style={{ fontSize:11, fontWeight:700, color:'#2E7D32' }}>+5€</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VENTES */}
        {onglet==='ventes' && (
          <div>
            {[
              { emoji:'🎸', title:'Guitare vintage 1969', sub:'En vente · Prix fixe', price:'340 €', status:'live' },
              { emoji:'👜', title:'Sac cuir artisanal',   sub:'En vente · Prix fixe', price:'180 €', status:'live' },
              { emoji:'🖼️', title:'Tableau aquarelle',    sub:'Vendu',                price:'210 €', status:'sold' },
              { emoji:'⌚', title:'Montre mécanique',     sub:'Expiré',               price:'0 €',   status:'end'  },
            ].map((s,i) => (
              <div key={i} style={{ background:'#fff', border:'0.5px solid #f0eded', borderRadius:12, padding:'10px 12px', display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                <div style={{ width:42, height:42, borderRadius:8, background:'#FDEDEC', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{s.emoji}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'#111', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.title}</div>
                  <div style={{ fontSize:10, color:'#aaa', marginTop:2 }}>{s.sub}</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontSize:12, fontWeight:800, color:P }}>{s.price}</div>
                  <span style={{ fontSize:9, padding:'2px 7px', borderRadius:10, fontWeight:600, display:'inline-block', marginTop:3, background: s.status==='live'?'#FDEDEC':s.status==='sold'?'#E8F5E9':'#f0f0f0', color: s.status==='live'?P:s.status==='sold'?'#2E7D32':'#888' }}>
                    {s.status==='live' ? '● En vente' : s.status==='sold' ? '✓ Vendu' : 'Expiré'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* REVENUS */}
        {onglet==='revenus' && (
          <div>
            <div style={{ background:'#fff', border:'0.5px solid #f0eded', borderRadius:12, padding:13, marginBottom:10 }}>
              <div style={{ fontSize:11, fontWeight:600, color:'#aaa', marginBottom:6 }}>REVENUS CE MOIS</div>
              <div style={{ fontSize:22, fontWeight:800, color:P }}>332 €</div>
              <div style={{ fontSize:10, color:'#bbb', marginTop:2 }}>+18% vs mois dernier</div>
              <div style={{ marginTop:10 }}>
                {[{l:'Lun',w:40,v:'32€'},{l:'Mar',w:65,v:'52€'},{l:'Mer',w:30,v:'24€'},{l:'Jeu',w:80,v:'64€'},{l:'Ven',w:55,v:'44€'},{l:'Sam',w:100,v:'80€'},{l:'Dim',w:45,v:'36€'}].map(b => (
                  <div key={b.l} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
                    <div style={{ fontSize:9, color:'#aaa', width:26, textAlign:'right' }}>{b.l}</div>
                    <div style={{ flex:1, height:5, background:'#f5f5f5', borderRadius:3, overflow:'hidden' }}>
                      <div style={{ width:`${b.w}%`, height:'100%', background:P, borderRadius:3 }}/>
                    </div>
                    <div style={{ fontSize:9, fontWeight:700, color:'#111', width:32, textAlign:'right' }}>{b.v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:'#fff', border:'0.5px solid #f0eded', borderRadius:12, padding:13 }}>
              <div style={{ fontSize:11, fontWeight:600, color:'#aaa', marginBottom:7 }}>RÉSUMÉ</div>
              {[['Articles vendus','7'],['Articles en vente','2'],['Taux de vente','87%'],['Note vendeur','⭐ 4.9']].map(([l,v]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize:11, padding:'5px 0', borderBottom:'0.5px solid #f5f0f0' }}>
                  <span style={{ color:'#bbb' }}>{l}</span>
                  <span style={{ fontWeight:700, color:P }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

const card: React.CSSProperties = { background:'#fff', border:'0.5px solid #f0eded', borderRadius:12, padding:13, marginBottom:10 }
const cardTtl: React.CSSProperties = { fontSize:12, fontWeight:700, color:'#111', marginBottom:10 }
const fl: React.CSSProperties = { marginBottom:9 }
const lbl: React.CSSProperties = { display:'block', fontSize:9, fontWeight:600, color:'#aaa', marginBottom:3, textTransform:'uppercase', letterSpacing:.4 }
const inp: React.CSSProperties = { width:'100%', background:'#fafafa', border:'0.5px solid #eedede', borderRadius:8, padding:'7px 9px', fontSize:11, color:'#222', outline:'none' }