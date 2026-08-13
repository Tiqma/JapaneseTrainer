import { useState } from 'react'
import { supabase } from '../supabaseClient'

function AddWord() {
  const [japanese, setJapanese] = useState('')
  const [romaji, setRomaji] = useState('')
  const [answer, setAnswer] = useState('')
  const [category, setCategory] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.from('words').insert({
      japanese,
      romaji,
      answer,
      category: category || 'general',
    })

    if (error) {
      setMessage(`Fel: ${error.message}`)
    } else {
      setMessage(`"${japanese}" lades till!`)
      setJapanese('')
      setRomaji('')
      setAnswer('')
      setCategory('')
    }

    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 360, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Lägg till ord</h1>

      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', marginBottom: '0.75rem' }}>
          Japanska (kanji/kana)
          <input
            type="text"
            value={japanese}
            onChange={(e) => setJapanese(e.target.value)}
            required
            style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: '0.75rem' }}>
          Romaji
          <input
            type="text"
            value={romaji}
            onChange={(e) => setRomaji(e.target.value)}
            required
            style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: '0.75rem' }}>
          Svensk översättning
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: '1rem' }}>
          Kategori (valfritt)
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="t.ex. mat, djur..."
            style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </label>

        <button type="submit" disabled={loading} style={{ padding: '0.5rem 1.5rem' }}>
          {loading ? 'Sparar...' : 'Lägg till'}
        </button>
      </form>

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  )
}

export default AddWord
export { AddWord }