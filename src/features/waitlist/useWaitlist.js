import emailjs from '@emailjs/browser'

const SERVICE_ID  = 'service_81lbacv'
const TEMPLATE_ID = 'template_jooia8e'
const PUBLIC_KEY  = '9MT_fVS0T1iAhhljE'

export const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

export const saveToWaitlist = (email, source) => {
  const entry = { email: email.trim(), source, joinedAt: new Date().toISOString() }
  const existing = JSON.parse(localStorage.getItem('taja_waitlist') || '[]')
  localStorage.setItem('taja_waitlist', JSON.stringify([...existing, entry]))

  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      user_email: entry.email,
      message:    `source: ${source}`,
      time:       new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' }),
      name:       entry.email,
    },
    PUBLIC_KEY
  )
}