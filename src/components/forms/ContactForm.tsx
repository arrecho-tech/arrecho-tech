'use client'

import React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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

function extractText(value: unknown): string {
  if (typeof value === 'string') return value
  if (!value || typeof value !== 'object') return ''

  // Lexical richText often looks like { root: { children: [...] } }
  const root = (value as { root?: unknown }).root
  const out: string[] = []

  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return
    const maybeText = (node as { text?: unknown }).text
    if (typeof maybeText === 'string') out.push(maybeText)

    const children = (node as { children?: unknown }).children
    if (Array.isArray(children)) children.forEach(walk)
  }

  walk(root)

  return out.join('').replace(/\s+/g, ' ').trim()
}

function Field({ field, value, setValue }: {
  field: ContactFormFieldBlock
  value: unknown
  setValue: (v: unknown) => void
}) {
  if (field.blockType === 'message') {
    const text = extractText(field.message)
    if (!text) return null

    return (
      <div className="rounded-md border border-neutral-200/20 bg-black/30 p-4 text-sm text-neutral-100 backdrop-blur-md dark:border-neutral-800/40">
        {text}
      </div>
    )
  }

  const name = field.name || ''
  const label = getLabel(field.label) || name

  if (!name) return null

  if (field.blockType === 'textarea') {
    return (
      <div className="grid gap-2">
        <Label htmlFor={name}>{label}</Label>
        <Textarea
          id={name}
          name={name}
          required={Boolean(field.required)}
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    )
  }

  if (field.blockType === 'checkbox') {
    return (
      <div className="flex items-center gap-2">
        <input
          id={name}
          type="checkbox"
          name={name}
          checked={Boolean(value)}
          onChange={(e) => setValue(e.target.checked)}
          className="h-4 w-4"
        />
        <Label htmlFor={name}>{label}</Label>
      </div>
    )
  }

  if (field.blockType === 'select') {
    return (
      <div className="grid gap-2">
        <Label htmlFor={name}>{label}</Label>
        <select
          id={name}
          name={name}
          required={Boolean(field.required)}
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => setValue(e.target.value)}
          className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-800"
        >
          <option value="">Select…</option>
          {(field.options ?? []).map((opt, idx) => (
            <option key={idx} value={opt.value ?? ''}>
              {getLabel(opt.label) || opt.value || ''}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (field.blockType === 'radio') {
    return (
      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium leading-none">{label}</legend>
        <div className="grid gap-2">
          {(field.options ?? []).map((opt, idx) => {
            const optValue = opt.value ?? ''
            const id = `${name}-${idx}`
            return (
              <div key={idx} className="flex items-center gap-2">
                <input
                  id={id}
                  type="radio"
                  name={name}
                  value={optValue}
                  checked={value === optValue}
                  onChange={() => setValue(optValue)}
                  className="h-4 w-4"
                />
                <Label htmlFor={id}>{getLabel(opt.label) || optValue}</Label>
              </div>
            )
          })}
        </div>
      </fieldset>
    )
  }

  const type = field.blockType === 'email' ? 'email' : field.blockType === 'number' ? 'number' : 'text'

  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type}
        name={name}
        required={Boolean(field.required)}
        value={typeof value === 'string' || typeof value === 'number' ? String(value) : ''}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
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
    const confirmationText = extractText(form.confirmationMessage)

    return (
      <div
        aria-label="contact-received"
        className="mt-10 w-full max-w-2xl rounded-xl border border-white/10 bg-black/30 p-6 text-sm backdrop-blur-md"
      >
        {confirmationText || 'Received — thanks! We’ll get back to you soon.'}
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      aria-label="contact-form"
      className="mt-10 w-full max-w-2xl rounded-xl border border-white/10 bg-black/30 p-6 backdrop-blur-md"
    >
      <h2 className="mb-6 text-2xl font-semibold tracking-tight">Contact</h2>

      <div className="grid gap-4">
        {form.fields.map((f, idx) => (
          <Field
            key={f.id || idx}
            field={f}
            value={values[f.name || '']}
            setValue={(v) => setValue(f.name || '', v)}
          />
        ))}

        <div className="pt-2">
          <Button type="submit" disabled={status.kind === 'submitting'}>
            {status.kind === 'submitting' ? 'Sending…' : 'Send'}
          </Button>
        </div>

        {status.kind === 'error' && (
          <div role="alert" className="text-sm text-red-400">
            Error: {status.message}
          </div>
        )}
      </div>
    </form>
  )
}
