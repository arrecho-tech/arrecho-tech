'use client'

import React from 'react'

import type { ContactFormFieldBlock, SanitizedContactForm } from '@/utils/contactForm'

type Props = {
  form: SanitizedContactForm
}

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; message: string }

function getLabel(label: unknown): string {
  if (typeof label === 'string') return label
  // Payload localized fields can sometimes be objects like { en: 'Name' }
  if (label && typeof label === 'object') {
    const maybe = (label as { en?: unknown }).en
    if (typeof maybe === 'string') return maybe
  }
  return ''
}

function Field({ field, value, setValue }: {
  field: ContactFormFieldBlock
  value: unknown
  setValue: (v: unknown) => void
}) {
  const name = field.name || ''
  const label = getLabel(field.label) || name

  if (!name) return null

  if (field.blockType === 'message') {
    return null
  }

  if (field.blockType === 'textarea') {
    return (
      <label style={{ display: 'block', marginBottom: 12 }}>
        <div style={{ marginBottom: 6 }}>{label}</div>
        <textarea
          name={name}
          required={Boolean(field.required)}
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => setValue(e.target.value)}
          style={{ width: '100%', minHeight: 120 }}
        />
      </label>
    )
  }

  if (field.blockType === 'checkbox') {
    return (
      <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <input
          type="checkbox"
          name={name}
          checked={Boolean(value)}
          onChange={(e) => setValue(e.target.checked)}
        />
        <span>{label}</span>
      </label>
    )
  }

  if (field.blockType === 'select') {
    return (
      <label style={{ display: 'block', marginBottom: 12 }}>
        <div style={{ marginBottom: 6 }}>{label}</div>
        <select
          name={name}
          required={Boolean(field.required)}
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => setValue(e.target.value)}
          style={{ width: '100%' }}
        >
          <option value="">Select…</option>
          {(field.options ?? []).map((opt, idx) => (
            <option key={idx} value={opt.value ?? ''}>
              {getLabel(opt.label) || opt.value || ''}
            </option>
          ))}
        </select>
      </label>
    )
  }

  if (field.blockType === 'radio') {
    return (
      <fieldset style={{ border: 'none', padding: 0, margin: '0 0 12px' }}>
        <legend style={{ marginBottom: 6 }}>{label}</legend>
        {(field.options ?? []).map((opt, idx) => {
          const optValue = opt.value ?? ''
          return (
            <label key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="radio"
                name={name}
                value={optValue}
                checked={value === optValue}
                onChange={() => setValue(optValue)}
              />
              <span>{getLabel(opt.label) || optValue}</span>
            </label>
          )
        })}
      </fieldset>
    )
  }

  const type = field.blockType === 'email' ? 'email' : field.blockType === 'number' ? 'number' : 'text'

  return (
    <label style={{ display: 'block', marginBottom: 12 }}>
      <div style={{ marginBottom: 6 }}>{label}</div>
      <input
        type={type}
        name={name}
        required={Boolean(field.required)}
        value={typeof value === 'string' || typeof value === 'number' ? String(value) : ''}
        onChange={(e) => setValue(e.target.value)}
        style={{ width: '100%' }}
      />
    </label>
  )
}

export function ContactForm({ form }: Props) {
  const [status, setStatus] = React.useState<Status>({ kind: 'idle' })
  const [values, setValues] = React.useState<Record<string, unknown>>({})

  const setValue = React.useCallback((field: string, v: unknown) => {
    setValues((prev) => ({ ...prev, [field]: v }))
  }, [])

  const onSubmit = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus({ kind: 'submitting' })

    const res = await fetch('/api/contact-submit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ submissionDataMap: values }),
    })

    if (res.ok) {
      setStatus({ kind: 'success' })
      return
    }

    const data = (await res
      .json()
      .catch(() => null)) as null | { error?: string }
    setStatus({ kind: 'error', message: data?.error || 'submit_failed' })
  }, [values])

  if (status.kind === 'success') {
    return <div aria-label="contact-received">Received — thanks! We’ll get back to you soon.</div>
  }

  return (
    <form onSubmit={onSubmit} aria-label="contact-form">
      <h2 style={{ marginTop: 32 }}>Contact</h2>
      {form.fields.map((f, idx) => (
        <Field
          key={f.id || idx}
          field={f}
          value={values[f.name || '']}
          setValue={(v) => setValue(f.name || '', v)}
        />
      ))}
      <button type="submit" disabled={status.kind === 'submitting'}>
        {status.kind === 'submitting' ? 'Sending…' : 'Send'}
      </button>
      {status.kind === 'error' && (
        <div role="alert" style={{ marginTop: 12 }}>
          Error: {status.message}
        </div>
      )}
    </form>
  )
}
