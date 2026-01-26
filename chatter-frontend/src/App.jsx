import { useEffect } from 'react'
import TypingInput from './components/TypingInput'

function App() {
  useEffect(() => {
    window.Echo.private('space.1')
      .listen('.UserTyping', (e) => {
        console.log('🟢 USER TYPING:', e.userName)
      })
  
    return () => {
      window.Echo.leave('space.1')
    }
  }, [])
  
  
  return (
    <div>
      <h1>Chatter 🚀</h1>
      <TypingInput />
    </div>
  )
}

export default App


