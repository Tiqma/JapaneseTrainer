import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

type WordRow = {
  id: number
  japanese: string
  romaji: string
  answer: string
}

function normalize(text: string) {
  return text.trim().toLowerCase()
}

export default function Words() {
  const [words, setWords] = useState<WordRow[]>([])
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [checked, setChecked] = useState<Record<number, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Hämta orden från databasen när sidan laddas
  useEffect(() => {
    const fetchWords = async () => {
      const { data, error } = await supabase
        .from('words')
        .select('id, japanese, romaji, answer')
        .limit(3)

      if (error) {
        console.error('Kunde inte hämta ord:', error.message)
      } else if (data) {
        setWords(data)
      }
      setLoading(false)
    }

    fetchWords()
  }, [])

  const handleChange = (wordId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [wordId]: value }))
  }

  const handleCheck = async (word: WordRow) => {
    const userAnswer = answers[word.id] || ''
    const isCorrect = normalize(userAnswer) === normalize(word.answer)

    setChecked((prev) => ({ ...prev, [word.id]: true }))

    // Hämta inloggad användare
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return // ej inloggad, spara ingen progress

    setSaving(true)

    // Kolla om det redan finns en rad för denna user+word
    const { data: existing } = await supabase
      .from('user_progress')
      .select('id, correct_count, incorrect_count')
      .eq('user_id', user.id)
      .eq('word_id', word.id)
      .maybeSingle()

    if (existing) {
      await supabase
        .from('user_progress')
        .update({
          correct_count: existing.correct_count + (isCorrect ? 1 : 0),
          incorrect_count: existing.incorrect_count + (isCorrect ? 0 : 1),
          last_reviewed: new Date().toISOString(),
        })
        .eq('id', existing.id)
    } else {
      await supabase.from('user_progress').insert({
        user_id: user.id,
        word_id: word.id,
        correct_count: isCorrect ? 1 : 0,
        incorrect_count: isCorrect ? 0 : 1,
      })
    }

    setSaving(false)
  }

  const handleReset = () => {
    setAnswers({})
    setChecked({})
  }

  if (loading) return <p>Laddar ord...</p>

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Översätt orden</h1>

      {words.map((word) => {
        const userAnswer = answers[word.id] || ''
        const isChecked = checked[word.id]
        const isCorrect = normalize(userAnswer) === normalize(word.answer)

        return (
          <div key={word.id} style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '2rem' }}>{word.japanese}</div>
            <div style={{ color: '#888', marginBottom: '0.5rem' }}>{word.romaji}</div>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => handleChange(word.id, e.target.value)}
              placeholder="Skriv översättning..."
              style={{
                padding: '0.5rem',
                width: '100%',
                boxSizing: 'border-box',
                border: isChecked
                  ? `2px solid ${isCorrect ? 'green' : 'red'}`
                  : '1px solid #ccc',
              }}
            />
            {isChecked && !isCorrect && (
              <div style={{ color: 'red', fontSize: '0.9rem' }}>
                Rätt svar: {word.answer}
              </div>
            )}
            <button onClick={() => handleCheck(word)} style={{ marginTop: '0.5rem' }}>
              Kolla svar
            </button>
          </div>
        )
      })}

      <button onClick={handleReset}>Börja om</button>
      {saving && <p style={{ color: '#888' }}>Sparar...</p>}
    </div>
  )
}