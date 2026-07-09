import { useState } from 'react'
import { BUSINESS, INQUIRY_TYPES } from '../data'
import { Icon } from './Icons'

export default function Contact() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: wire this up to your email/CRM (Formspree, Netlify Forms, etc.)
    // For now it just shows a success state with the captured values in console.
    const data = Object.fromEntries(new FormData(e.target).entries())
    console.log('New inquiry:', data)
    setSent(true)
  }

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="contact__grid">
          <aside className="contact__aside">
            <p className="eyebrow">Let’s Talk</p>
            <h2 className="section-title">Book a shoot or<br />start a retainer</h2>
            <p className="section-lede">
              Tell me what you’re after — a one-off session or an ongoing content
              partner. I’ll get back to you fast with next steps and pricing.
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

          {sent ? (
            <div className="form">
              <div className="form__success">
                <div className="check"><Icon.check /></div>
                <h3>Message sent</h3>
                <p>
                  Thanks — your inquiry’s in. I’ll be in touch within one business
                  day. In a hurry? Call or text {BUSINESS.phone}.
                </p>
              </div>
            </div>
          ) : (
            <form className="form" onSubmit={handleSubmit}>
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

              <button type="submit" className="btn btn--primary form__submit">
                Send Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
