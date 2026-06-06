import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import './App.css'

const API_BASE = 'http://localhost:8000/api/webhook'

function App() {
  const [events, setEvents] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE}/history/`)
      .then(r => r.json())
      .then(data => { setEvents(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1>⚡ GitSmart Docs</h1>
        <p>Auto-generated README on every push</p>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <h2>Push History</h2>
          {loading && <p className="muted">Loading...</p>}
          {!loading && events.length === 0 && <p className="muted">No pushes yet.</p>}
          {events.map(e => (
            <div
              key={e.id}
              className={`event-card ${selected?.id === e.id ? 'active' : ''}`}
              onClick={() => setSelected(e)}
            >
              <strong>{e.repo_name}</strong>
              <p>{e.commit_message}</p>
              <small>{new Date(e.pushed_at).toLocaleString()}</small>
            </div>
          ))}
        </aside>

        <main className="preview">
          {selected ? (
            <>
              <div className="preview-meta">
                <span>📁 {selected.repo_name}</span>
                <span>🗂 {selected.modified_files.join(', ')}</span>
              </div>
              <div className="markdown-body">
                <ReactMarkdown>{selected.generated_readme}</ReactMarkdown>
              </div>
            </>
          ) : (
            <div className="empty">
              <p>👈 Select a push event to preview its generated README</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
