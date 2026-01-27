import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN || 'http://127.0.0.1:8000'

const REVERB_SCHEME = import.meta.env.VITE_REVERB_SCHEME || 'http'
const REVERB_HOST = import.meta.env.VITE_REVERB_HOST || '127.0.0.1'
const REVERB_PORT = Number(import.meta.env.VITE_REVERB_PORT || 8080)

window.Echo = new Echo({
  broadcaster: 'reverb', // ✅ MUST be reverb
  key: import.meta.env.VITE_REVERB_APP_KEY,

  wsHost: REVERB_HOST,
  wsPort: REVERB_PORT,
  wssPort: REVERB_PORT,

  forceTLS: REVERB_SCHEME === 'https',
  enabledTransports: ['ws', 'wss'], // ❌ no sockjs, no xhr

  authEndpoint: `${API_ORIGIN}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      Accept: 'application/json',
    },
  },
})
