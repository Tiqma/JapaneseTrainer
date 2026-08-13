import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { supabase } from './supabaseClient'
import type { Session } from '@supabase/supabase-js'

import Words from './pages/words'
import Auth from './pages/Auth'
import Hiragana from './pages/Hiragana'
import TeFormTraining from './pages/TeFormTraining'
import TaFormTraining from './pages/TaFormTraining'
import NaiFormTraining from './pages/NaiFormTraining'
import AddWord from './pages/AddWord'
import WordList from './pages/WordList'

function Home() {
  return (
    <div>
      <h1>Hello World</h1>
      <Link to="/words">Gå till Ord</Link>
      <br />
      <Link to="/hiragana">Gå till Hiragana</Link>
      <br />
      <Link to="/te-form">Gå till Te-form</Link>
      <br />
      <Link to="/ta-form">Gå till Ta-form</Link>
      <br />
      <Link to="/nai-form">Gå till Nai-form</Link>
      <br />
      <Link to="/add-word">Gå till Lägg till ord</Link>
      <br />
      <Link to="/word-list">Gå till Ordlista</Link>
    </div>
  )
}


function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (loading) return <p>Laddar...</p>

  if (!session) {
    return <Auth />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/words" element={<Words />} />
        <Route path="/hiragana" element={<Hiragana />} />
        <Route path="/te-form" element={<TeFormTraining />} />
        <Route path="/ta-form" element={<TaFormTraining />} />
        <Route path="/nai-form" element={<NaiFormTraining />} />
        <Route path="/add-word" element={<AddWord />} />
        <Route path="/word-list" element={<WordList />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
