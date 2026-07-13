import { useState } from 'react'
import { BUSINESS, INQUIRY_TYPES, CONTACT_FORM } from '../data'
import { Icon } from './Icons'

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const data = new FormData(form)

    // No key configured yet → keep the demo success state (nothing is emailed).
    if (!CONTACT_FORM.web3formsKey) {
      console.log('New inquiry (demo, set CONTACT_FORM.web3formsKey to email):',
        Object.fromEntries(data.entries()))
      setStatus('sent')
      return
    }

    // Enrich the payload so the email is easy to read + reply to.
    data.append('access_key', CONTACT_FORM.web3formsKey)
    data.append('from_name', 'Paperview Productions Website')
    data.append('subject', `New inquiry: ${data.get('inquiryType') || 'General'} from ${data.get('name')}`)
    data.append('replyto', data.get('email'))

    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      })
      const json = await res.json()
      if (json.success) {
        setStatus('sent')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="contact__grid">
          <aside className="contact__aside">
            <p className="eyebrow">Let’s Talk</p>
            <h2 className="section-title">Book a shoot or<br />start a retainer</h2>
            <p className="section-lede">
              Tell us what you’re after, whether that's a one-off session or an
              ongoing content partner. We’ll get back to you fast with next steps
              and pricing.
            </p>

            <div className="contact__lines">
              <div className="contact__line">
                <Icon.mail />
                <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
              </div>
              <div className="contact__line">
                <Icon.phone />
                <a href={`tel:${BUSINESS.phone.replace(/[^0-9+]/g, '')}`}>{BUSINESS.phone}</a>
              </div>
              <div className="contact__line">
                <Icon.pin />
                <span>{BUSINESS.location} &amp; surrounding areas</span>
              </div>
              <div className="contact__line">
                <Icon.instagram />
                <a href={BUSINESS.instagram} target="_blank" rel="noreferrer">
                  @Paperviewproductions
                </a>
              </div>
            </div>
          </aside>

          {status === 'sent' ? (
            <div className="form">
              <div className="form__success">
                <div className="check"><Icon.check /></div>
                <h3>Message sent</h3>
                <p>
                  Thanks, your inquiry’s in. We’ll be in touch within one business
                  day. In a hurry? Call or text {BUSINESS.phone}.
                </p>
              </div>
            </div>
          ) : (
            <form className="form" onSubmit={handleSubmit}>
              {/* Honeypot spam trap (hidden from real users) */}
              <input
                type="checkbox"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                style={{ display: 'none' }}
              />

              <div className="form__row">
                <div className="field">
                  <label htmlFor="name">Name <span className="req">*</span></label>
                  <input id="name" name="name" type="text" required placeholder="Your name" />
                </div>
                <div className="field">
                  <label htmlFor="business">Business (optional)</label>
                  <input id="business" name="business" type="text" placeholder="Gym, company, or n/a" />
                </div>
              </div>

              <div className="form__row">
                <div className="field">
                  <label htmlFor="email">Email <span className="req">*</span></label>
                  <input id="email" name="email" type="email" required placeholder="you@email.com" />
                </div>
                <div className="field">
                  <label htmlFor="phone">Phone</label>
                  <input id="phone" name="phone" type="tel" placeholder="(978) 555-0123" />
                </div>
              </div>

              <div className="field">
                <label htmlFor="type">What do you need? <span className="req">*</span></label>
                <select id="type" name="inquiryType" required defaultValue="">
                  <option value="" disabled>Select a service…</option>
                  {INQUIRY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="message">Project details <span className="req">*</span></label>
                <textarea
                  id="message"
                  name="message"
                  required
                  placeholder="Tell me about your business, goals, timeline, and whether you're after ongoing work or a one-time shoot."
                />
              </div>

              {status === 'error' && (
                <p className="form__error">
                  Something went wrong sending your inquiry. Please try again, or
                  email <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> directly.
                </p>
              )}

              <button
                type="submit"
                className="btn btn--primary form__submit"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Sending…' : 'Send Inquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
