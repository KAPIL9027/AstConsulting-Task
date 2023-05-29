import { useState } from 'react'
import {BrowserRouter,Routes, Route} from 'react-router-dom'
import Header from './components/Header'
import Account from './components/Account'
import Settings from './components/Settings'


function App() {
  

  return (
    <>
      <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Account/>}/>
        <Route path="/settings" element={<Settings/>}/>
      </Routes>
      </BrowserRouter>
      
      
    </>
  )
}

export default App
