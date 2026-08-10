import { Link } from 'react-router-dom'
import type { CSSProperties } from 'react'

export default function ReturnToMenu({ style }: { style?: CSSProperties }) {
  return (
    <div style={{ textAlign: 'left', marginBottom: '1rem', ...(style || {}) }}>
      <Link to="/" style={{ color: '#0066cc', textDecoration: 'none' }}>
        Till meny
      </Link>
    </div>
  )
}
