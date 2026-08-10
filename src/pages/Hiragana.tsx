import { useState } from 'react'
import ReturnToMenu from '../components/ReturnToMenu'
import hiraganaData from '../data/hiragana.json'

type HiraganaItem = {
  char: string
  romaji: string
}

const hiraganaSet: HiraganaItem[] = hiraganaData

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

export default function HiraganaTraining() {
  const [order, setOrder] = useState<HiraganaItem[]>(() => shuffle(hiraganaSet))
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const current = order[index]
  const isCorrect = checked && normalize(answer) === normalize(current.romaji)

  const handleCheck = () => {
    if (checked) return // förhindra dubbelklick
    setChecked(true)
    if (normalize(answer) === normalize(current.romaji)) {
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
    setOrder(shuffle(hiraganaSet))
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
      <div style={{ maxWidth: 360, margin: '4rem auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
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
    <div style={{ maxWidth: 360, margin: '2rem auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <ReturnToMenu />
      <h1>Öva hiragana</h1>
      <p style={{ color: '#888' }}>
        Tecken {index + 1} av {order.length} — {correctCount} rätt, {wrongCount} fel
      </p>

      <div style={{ fontSize: '5rem', margin: '1.5rem 0' }}>{current.char}</div>

      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Skriv romaji..."
        autoFocus
        disabled={checked}
        style={{
          padding: '0.5rem',
          width: '100%',
          boxSizing: 'border-box',
          fontSize: '1.2rem',
          textAlign: 'center',
          border: checked
            ? `2px solid ${isCorrect ? 'green' : 'red'}`
            : '1px solid #ccc',
        }}
      />

      {checked && !isCorrect && (
        <p style={{ color: 'red' }}>Rätt svar: {current.romaji}</p>
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