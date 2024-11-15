import { useState } from 'react'
import './App.css'
import Employee from './Employee'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Employee/>
    </>
  )
}

export default App
