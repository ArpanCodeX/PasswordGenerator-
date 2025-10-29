import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-white/90 text-center text-xs text-gray-700 border-t">
      <div className="max-w-4xl mx-auto px-4 h-10 flex items-center justify-center">
        <span className="truncate">© {new Date().getFullYear()} PasswordGenerator • Built by ArpanCodeX</span>
        <span className="mx-2 hidden sm:inline">|</span>
        <a href="https://github.com/ArpanCodeX" className="text-cyan-700 hover:underline ml-2" target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </footer>
  )
}

export default Footer
