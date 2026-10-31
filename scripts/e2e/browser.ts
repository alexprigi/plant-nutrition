import { chromium, type Browser, type Page } from 'playwright-core'
import { SkipTest } from './lib'

// Browser vero (Google Chrome installato sul computer, nessun download di browser).
// Se Chrome non c'e' il test viene saltato, non fallisce.
export async function openBrowser(): Promise<Browser> {
  try {
    return await chromium.launch({ channel: 'chrome', headless: true })
  } catch {
    throw new SkipTest('Google Chrome non trovato')
  }
}

export async function withPage<T>(run: (page: Page) => Promise<T>): Promise<T> {
  const browser = await openBrowser()
  try {
    return await run(await browser.newPage())
  } finally {
    await browser.close()
  }
}

// Il banner dei cookie copre la pagina e intercetta i clic
export async function rejectCookies(page: Page, label: string): Promise<void> {
  // Il banner compare con un piccolo ritardo dopo il caricamento
  const button = page.getByRole('button', { name: new RegExp(label, 'i') }).first()
  const appeared = await button.waitFor({ timeout: 5000 }).then(() => true, () => false)
  if (appeared) await button.click()
}
