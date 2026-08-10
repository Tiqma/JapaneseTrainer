import { useState } from 'react'
import ReturnToMenu from './ReturnToMenu'
import verbsData from '../data/verbs.json'

type Verb = {
  kanji: string
  reading: string
  romaji: string
  group: string
  meaning: string
  te: string
  teRomaji: string
  ta: string
  taRomaji: string
  nai: string
  naiRomaji: string
}

type Mode = 'te' | 'ta' | 'nai'

const verbs: Verb[] = verbsData

const groupLabels: Record<string, string> = {
  ichidan: 'Ichidan (る-verb)',
  godan: 'Godan (う-verb)',
  'godan-irregular': 'Godan (oregelbunden)',
  irregular: 'Helt oregelbunden',
}

const modeConfig: Record<Mode, { title: string; hint: string; kanaKey: 'te' | 'ta' | 'nai'; romajiKey: 'teRomaji' | 'taRomaji' | 'naiRomaji' }> = {
  te: { title: 'Öva te-formen', hint: 'Skriv te-formen (romaji eller kana)...', kanaKey: 'te', romajiKey: 'teRomaji' },
  ta: { title: 'Öva ta-formen (dåtid)', hint: 'Skriv ta-formen (romaji eller kana)...', kanaKey: 'ta', romajiKey: 'taRomaji' },
  nai: { title: 'Öva nai-formen (negation)', hint: 'Skriv nai-formen (romaji eller kana)...', kanaKey: 'nai', romajiKey: 'naiRomaji' },
}

function normalize(text: string) {
  return text.trim().toLowerCase()
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function VerbFormTraining({ mode }: { mode: Mode }) {
  const config = modeConfig[mode]
  const [order, setOrder] = useState<Verb[]>(() => shuffle(verbs))
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const current = order[index]
  const correctKana = current[config.kanaKey]
  const correctRomaji = current[config.romajiKey]

  const isCorrect =
    checked &&
    (normalize(answer) === normalize(correctRomaji) || normalize(answer) === normalize(correctKana))

  const handleCheck = () => {
    if (checked || !answer.trim()) return
    setChecked(true)
    const correct =
      normalize(answer) === normalize(correctRomaji) || normalize(answer) === normalize(correctKana)
    if (correct) {
      setCorrectCount((c) => c + 1)
    } else {
      setWrongCount((c) => c + 1)
    }
  }

  const handleNext = () => {
    if (index + 1 >= order.length) {
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    setAnswer('')
    setChecked(false)
  }

  const handleRestart = () => {
    setOrder(shuffle(verbs))
    setIndex(0)
    setAnswer('')
    setChecked(false)
    setCorrectCount(0)
    setWrongCount(0)
    setFinished(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!checked) {
        handleCheck()
      } else {
        handleNext()
      }
    }
  }

  if (finished) {
    return (
      <div style={{ maxWidth: 380, margin: '4rem auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <ReturnToMenu />
        <h1>Klart!</h1>
        <p>
          Du fick {correctCount} av {order.length} rätt ({wrongCount} fel).
        </p>
        <button onClick={handleRestart} style={{ padding: '0.5rem 1rem' }}>
          Kör igen
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 380, margin: '2rem auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <ReturnToMenu />
      <h1>{config.title}</h1>
      <p style={{ color: '#888' }}>
        Verb {index + 1} av {order.length} — {correctCount} rätt, {wrongCount} fel
      </p>

      <div style={{ fontSize: '3rem', margin: '1rem 0' }}>{current.kanji}</div>
      <div style={{ color: '#666', marginBottom: '0.25rem' }}>
        {current.reading} ({current.romaji}) — {current.meaning}
      </div>
      <div style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '1rem' }}>
        {groupLabels[current.group]}
      </div>

      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={config.hint}
        autoFocus
        disabled={checked}
        style={{
          padding: '0.5rem',
          width: '100%',
          boxSizing: 'border-box',
          fontSize: '1.1rem',
          textAlign: 'center',
          border: checked
            ? `2px solid ${isCorrect ? 'green' : 'red'}`
            : '1px solid #ccc',
        }}
      />

      {checked && !isCorrect && (
        <p style={{ color: 'red' }}>
          Rätt svar: {correctKana} ({correctRomaji})
        </p>
      )}
      {checked && isCorrect && <p style={{ color: 'green' }}>Rätt!</p>}

      <div style={{ marginTop: '1rem' }}>
        {!checked ? (
          <button onClick={handleCheck} style={{ padding: '0.5rem 1.5rem' }}>
            Kolla svar
          </button>
        ) : (
          <button onClick={handleNext} style={{ padding: '0.5rem 1.5rem' }}>
            Nästa
          </button>
        )}
      </div>
    </div>
  )
}