import { localizedMetadata } from '@/lib/metadata';

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return localizedMetadata(params, 'gestisci', { robots: { index: false, follow: false } });
}

export default function ManageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
