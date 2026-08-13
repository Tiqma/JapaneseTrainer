import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

type WordRow = {
  id: number
  japanese: string
  romaji: string
  answer: string
  category: string | null
}

type SortField = 'japanese' | 'romaji' | 'answer'
type SortDirection = 'asc' | 'desc'

export default function WordList() {
  const [words, setWords] = useState<WordRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortField, setSortField] = useState<SortField>('romaji')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  useEffect(() => {
    const fetchWords = async () => {
      const { data, error } = await supabase
        .from('words')
        .select('id, japanese, romaji, answer, category')

      if (error) {
        setError(error.message)
      } else if (data) {
        setWords(data)
      }
      setLoading(false)
    }

    fetchWords()
  }, [])

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // Klicka på samma kolumn igen vänder ordningen
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedWords = [...words].sort((a, b) => {
    const valA = a[sortField].toLowerCase()
    const valB = b[sortField].toLowerCase()
    const comparison = valA.localeCompare(valB, 'ja')
    return sortDirection === 'asc' ? comparison : -comparison
  })

  const sortArrow = (field: SortField) => {
    if (field !== sortField) return ''
    return sortDirection === 'asc' ? ' ▲' : ' ▼'
  }

  if (loading) return <p style={{ fontFamily: 'sans-serif', textAlign: 'center' }}>Laddar ord...</p>
  if (error) return <p style={{ color: 'red', fontFamily: 'sans-serif', textAlign: 'center' }}>Fel: {error}</p>

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Alla ord ({words.length})</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th
              onClick={() => handleSort('japanese')}
              style={{ textAlign: 'left', padding: '0.5rem', cursor: 'pointer', userSelect: 'none' }}
            >
              Japanska{sortArrow('japanese')}
            </th>
            <th
              onClick={() => handleSort('romaji')}
              style={{ textAlign: 'left', padding: '0.5rem', cursor: 'pointer', userSelect: 'none' }}
            >
              Romaji{sortArrow('romaji')}
            </th>
            <th
              onClick={() => handleSort('answer')}
              style={{ textAlign: 'left', padding: '0.5rem', cursor: 'pointer', userSelect: 'none' }}
            >
              Översättning{sortArrow('answer')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedWords.map((word) => (
            <tr key={word.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem', fontSize: '1.2rem' }}>{word.japanese}</td>
              <td style={{ padding: '0.5rem', color: '#666' }}>{word.romaji}</td>
              <td style={{ padding: '0.5rem' }}>{word.answer}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {words.length === 0 && <p style={{ color: '#888' }}>Inga ord tillagda ännu.</p>}
    </div>
  )
}