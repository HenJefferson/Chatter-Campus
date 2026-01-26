import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

window.Echo = new Echo({
  broadcaster: 'reverb', // ✅ MUST be reverb
  key: import.meta.env.VITE_REVERB_APP_KEY,

  wsHost: '127.0.0.1',
  wsPort: 8080,
  wssPort: 8080,

  forceTLS: false,
  enabledTransports: ['ws'], // ❌ no sockjs, no xhr

  authEndpoint: 'http://127.0.0.1:8000/broadcasting/auth',
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      Accept: 'application/json',
    },
  },
})
