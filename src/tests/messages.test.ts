import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { LOCALES } from '@/i18n/locales'

type Tree = { [key: string]: string | Tree }
const load = (locale: string): Tree => JSON.parse(readFileSync(`messages/${locale}.json`, 'utf8'))

// Tutte le chiavi foglia, come percorsi "a.b.c"
const leaves = (tree: Tree, prefix = ''): string[] =>
  Object.entries(tree).flatMap(([k, v]) => (typeof v === 'string' ? [prefix + k] : leaves(v, `${prefix}${k}.`)))

describe('translation files', () => {
  const reference = leaves(load('it')).sort()

  it.each(LOCALES.filter((l) => l !== 'it'))('%s has exactly the same keys as it', (locale) => {
    const keys = leaves(load(locale)).sort()
    expect(keys.filter((k) => !reference.includes(k)), 'chiavi in più').toEqual([])
    expect(reference.filter((k) => !keys.includes(k)), 'chiavi mancanti').toEqual([])
  })

  it.each(LOCALES)('%s has no empty strings', (locale) => {
    const tree = load(locale)
    const get = (path: string) => path.split('.').reduce<string | Tree>((node, k) => (node as Tree)[k], tree) as string
    expect(leaves(tree).filter((p) => get(p).trim() === '')).toEqual([])
  })
})

// La pagina "Gestisci appuntamento" traduce gli errori a partire dal `code` restituito dall'API:
// un code senza traduzione mostrerebbe il testo italiano del server.
describe('manage appointment error codes', () => {
  const route = readFileSync('src/app/api/appointments/manage/route.ts', 'utf8')
  const codes = [...new Set([...route.matchAll(/code: '([A-Za-z]+)'/g)].map((m) => m[1]))]

  it('finds the codes used by the route', () => {
    expect(codes.length).toBeGreaterThanOrEqual(12)
  })

  it.each(LOCALES)('%s translates every code in gestisci.errori', (locale) => {
    const errori = (load(locale).gestisci as Tree).errori as Tree
    expect(codes.filter((c) => typeof errori[c] !== 'string')).toEqual([])
  })
})
