import { useState } from 'react'

export default function Typing({ spaceId }) {
  const [typing, setTyping] = useState(false)

  const handleTyping = async () => {
    if (typing) return
    setTyping(true)

    await fetch('http://127.0.0.1:8000/api/typing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        space_id: spaceId, // ✅ NOW CORRECT
      }),
    })

    setTimeout(() => setTyping(false), 2000)
  }

  return (
    <input
      type="text"
      placeholder="Type a message..."
      onKeyDown={handleTyping}
    />
  )
}
