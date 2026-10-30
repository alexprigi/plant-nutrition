import { resend } from '@/lib/email'

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

export async function sendClientEmail(params: Parameters<typeof resend.emails.send>[0]): Promise<boolean> {
  try {
    const result = await resend.emails.send(params)
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
