import React, { useEffect, useState, useRef } from 'react'
import { toast } from 'react-toastify'

const HISTORY_KEY = 'passwordGenerator.history'

const Header = () => {
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState([])
  const ref = useRef(null)

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem(HISTORY_KEY)
        const list = raw ? JSON.parse(raw) : []
        setHistory(list)
      } catch {
          setHistory([])
        }
    }
    load()

    const onCopied = (e) => {
      const entry = e.detail
      setHistory(prev => [entry, ...prev].slice(0, 10))
    }
    window.addEventListener('passwordCopied', onCopied)

    const onClickOutside = (ev) => {
      if (ref.current && !ref.current.contains(ev.target)) setOpen(false)
    }
    document.addEventListener('click', onClickOutside)

    return () => {
      window.removeEventListener('passwordCopied', onCopied)
      document.removeEventListener('click', onClickOutside)
    }
  }, [])

  const clearHistory = () => {
    try {
      localStorage.removeItem(HISTORY_KEY)
      setHistory([])
      toast.info('History cleared', { theme: 'colored' })
    } catch {
      // ignore
    }
  }

  const copyAgain = async (value) => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success('Password copied to clipboard!', { theme: 'colored' })
    } catch {
      toast.error('Could not copy password')
    }
  }

  return (
    <header className="bg-white/90 border-b">
      <div className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="font-semibold text-cyan-800">PasswordGenerator</div>
          <div className="text-xs text-gray-500">• Random secure passwords</div>
        </div>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(o => !o)}
            className="px-3 py-1 rounded-md border text-sm text-gray-700 bg-white hover:bg-gray-50"
            aria-expanded={open}
          >
            History
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow z-50 text-xs overflow-hidden">
              <div className="p-2 flex items-center justify-between border-b">
                <div className="font-medium">Last copied</div>
                <button onClick={clearHistory} className="text-red-500 text-xs">Clear</button>
              </div>
              <div className="max-h-48 overflow-auto">
                {history.length === 0 && <div className="p-2 text-center text-gray-500">No history</div>}
                {history.map((h, idx) => (
                  <div key={h.time + '_' + idx} className="p-2 flex items-center justify-between gap-2 border-b last:border-b-0">
                    <div className="truncate text-gray-800 mr-2" title={h.value}>{h.value}</div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => copyAgain(h.value)} className="text-cyan-700 text-xs">Copy</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
