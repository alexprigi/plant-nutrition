import type { Metadata } from 'next';

// Pagina privata del flusso di prenotazione: non va indicizzata e non eredita il canonical di /booking
export const metadata: Metadata = { robots: { index: false, follow: false }, alternates: {} };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
