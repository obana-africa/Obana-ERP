/**
 * WaitlistForm.jsx
 *
 * Flow:
 *  1. Validates fields client-side
 *  2. POSTs to Formspree  → notifies YOU (the team)
 *  3. Sends via EmailJS   → confirmation email back to the USER
 *
 * Required .env variables:
 *   VITE_FORMSPREE_ID          your Formspree form id  e.g. mbdeprda
 *   VITE_EMAILJS_SERVICE_ID    EmailJS service id
 *   VITE_EMAILJS_TEMPLATE_ID   EmailJS template id  (user confirmation template)
 *   VITE_EMAILJS_PUBLIC_KEY    EmailJS public key
 *
 * EmailJS template variables your template should use:
 *   {{to_email}}       — user's email address
 *   {{to_name}}        — user's full name
 *   {{business_name}}  — their business name
 */

import { useState } from 'react'
import emailjs from '@emailjs/browser'
import styles from './LandingPage.module.css'

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
const isValidPhone  = (v) => !v || /^\+?[\d\s-]{8,}$/.test(v.trim())

const FORMSPREE_URL = 'https://formspree.io/f/mbdeprda'

async function sendUserConfirmation({ fullName, email, businessName }) {
  try {
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        to_email:      email,
        to_name:       fullName,
        business_name: businessName,
        reply_to:      'hello@taoja.africa',   // update to your support email
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    )
  } catch (err) {
    // Silently log — Formspree already captured the entry
    console.warn('[EmailJS] Could not send confirmation:', err?.text ?? err)
  }
}

export default function WaitlistForm({
  onSuccess,
  source      = 'waitlist',
  buttonText  = 'Join waitlist',
}) {
  const [formData, setFormData]     = useState({ fullName: '', email: '', businessName: '', phone: '' })
  const [status, setStatus]         = useState('idle')   // idle | loading | success | error
  const [errorMsg, setErrorMsg]     = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  // ── Validation ────────────────────────────────────────
  const validate = () => {
    const errors = {}
    if (!formData.fullName.trim())     errors.fullName     = 'Full name is required'
    if (!formData.email.trim())        errors.email        = 'Email is required'
    else if (!isValidEmail(formData.email)) errors.email   = 'Please enter a valid email'
    if (!formData.businessName.trim()) errors.businessName = 'Business name is required'
    if (!isValidPhone(formData.phone)) errors.phone        = 'Please enter a valid phone number'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }))
  }

  // ── Submit ────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setStatus('loading')
    setErrorMsg('')

    // 1️⃣  POST JSON to Formspree API endpoint
    const payload = {
      fullName:     formData.fullName.trim(),
      email:        formData.email.trim(),
      businessName: formData.businessName.trim(),
      phone:        formData.phone.trim(),
      source,
    }

    try {
      const res = await fetch(FORMSPREE_URL, {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept':       'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const firstErr = data.errors ? Object.values(data.errors)[0] : null
        throw new Error(
          Array.isArray(firstErr)
            ? firstErr[0]
            : (firstErr ?? data.error ?? 'Submission failed. Please try again.')
        )
      }

      // 2️⃣  Send confirmation email to the user via EmailJS
      await sendUserConfirmation({
        fullName:     payload.fullName,
        email:        payload.email,
        businessName: payload.businessName,
      })

      // 3️⃣  Success
      setStatus('success')
      setFormData({ fullName: '', email: '', businessName: '', phone: '' })

    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message)
    }
  }

  // Success screen stays visible until the modal is closed manually

  // ── Success screen ────────────────────────────────────
  if (status === 'success') {
    return (
      <div className={styles.successScreen} role="status" aria-live="polite">

        {/* Animated checkmark */}
        <div className={styles.successIconWrap}>
          <svg
            className={styles.successIcon}
            viewBox="0 0 52 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle className={styles.successCircle} cx="26" cy="26" r="25" />
            <path className={styles.successCheck} d="M14 27l8 8 16-16" />
          </svg>
        </div>

        {/* Heading */}
        <h3 className={styles.successTitle}>You're on the list!</h3>

        {/* Subtext */}
        <p className={styles.successSub}>
          Welcome to ta'oja early access,{' '}
          <strong>{formData.fullName.split(' ')[0] || 'friend'}</strong>. We've sent a
          confirmation to <strong>{formData.email}</strong>. We'll be in
          touch when we launch.
        </p>

        {/* What happens next */}
        <div className={styles.successSteps}>
          <div className={styles.successStep}>
            <span className={styles.successStepIcon}></span>
            <span>Check your inbox for a confirmation email</span>
          </div>
          <div className={styles.successStep}>
            <span className={styles.successStepIcon}></span>
            <span>Get early access before the public launch</span>
          </div>
          <div className={styles.successStep}>
            <span className={styles.successStepIcon}></span>
            <span>Receive exclusive early-bird pricing</span>
          </div>
        </div>

        <button
          type="button"
          className={styles.successCloseBtn}
          onClick={() => onSuccess?.()}
        >
          Close
        </button>

      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────
  return (
    <form className={styles.waitlistForm} onSubmit={handleSubmit} noValidate>

      <div className={styles.formGroup}>
        <input
          type="text"
          name="fullName"
          className={styles.formInput}
          placeholder="Full name *"
          value={formData.fullName}
          onChange={handleChange}
          disabled={status === 'loading'}
          aria-invalid={!!fieldErrors.fullName}
          aria-describedby={fieldErrors.fullName ? 'err-fullName' : undefined}
        />
        {fieldErrors.fullName && (
          <span id="err-fullName" className={styles.fieldError}>{fieldErrors.fullName}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <input
          type="email"
          name="email"
          className={styles.formInput}
          placeholder="Email address *"
          value={formData.email}
          onChange={handleChange}
          disabled={status === 'loading'}
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? 'err-email' : undefined}
        />
        {fieldErrors.email && (
          <span id="err-email" className={styles.fieldError}>{fieldErrors.email}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <input
          type="text"
          name="businessName"
          className={styles.formInput}
          placeholder="Business name *"
          value={formData.businessName}
          onChange={handleChange}
          disabled={status === 'loading'}
          aria-invalid={!!fieldErrors.businessName}
          aria-describedby={fieldErrors.businessName ? 'err-biz' : undefined}
        />
        {fieldErrors.businessName && (
          <span id="err-biz" className={styles.fieldError}>{fieldErrors.businessName}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <input
          type="tel"
          name="phone"
          className={styles.formInput}
          placeholder="Phone number (optional)"
          value={formData.phone}
          onChange={handleChange}
          disabled={status === 'loading'}
          aria-invalid={!!fieldErrors.phone}
          aria-describedby={fieldErrors.phone ? 'err-phone' : undefined}
        />
        {fieldErrors.phone && (
          <span id="err-phone" className={styles.fieldError}>{fieldErrors.phone}</span>
        )}
      </div>

      <button
        type="submit"
        className={styles.btnWaitlist}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Submitting…' : buttonText}
      </button>

      {status === 'error' && (
        <p
          role="alert"
          style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '10px', textAlign: 'center' }}
        >
          {errorMsg}
        </p>
      )}

    </form>
  )
}