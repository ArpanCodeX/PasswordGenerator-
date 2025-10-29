import React from 'react'
import MainGen from './Components/MainGen'
import Header from './Components/Header'
import Footer from './Components/Footer'


const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <MainGen />
      </main>
      <Footer />
    </div>
  )
}

export default App