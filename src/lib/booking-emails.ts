import { resend } from '@/lib/email'

type SendParams = Parameters<typeof resend.emails.send>[0]

// Resend limita a ~2 richieste al secondo: su 429 riproviamo una volta dopo una breve pausa.
export const RATE_LIMIT_RETRY_MS = 1100

export async function sendWithRetry(params: SendParams) {
  let result = await resend.emails.send(params)
  if (result.error && (result.error.statusCode === 429 || result.error.name === 'rate_limit_exceeded')) {
    await new Promise((r) => setTimeout(r, RATE_LIMIT_RETRY_MS))
    result = await resend.emails.send(params)
  }
  return result
}

// Le funzioni serverless possono terminare appena la risposta è inviata: le email vanno attese.
// Entrambi gli helper non lanciano mai: loggano l'errore e restituiscono false.

export async function postBookingEmail(payload: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(`${process.env.AUTH_URL}/api/send-booking-emails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      console.error('send-booking-emails failed:', res.status, await res.text().catch(() => ''), payload.type)
      return false
    }
    return true
  } catch (err) {
    console.error('Failed to send booking email:', err)
    return false
  }
}

export async function sendClientEmail(params: SendParams): Promise<boolean> {
  try {
    const result = await sendWithRetry(params)
    if (result.error) {
      console.error('Resend error:', params.subject, result.error.message)
      return false
    }
    return true
  } catch (err) {
    console.error('Failed to send email:', params.subject, err)
    return false
  }
}
