import { localizedMetadata } from '@/lib/metadata';

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return localizedMetadata(params, 'contatti', {}, '/contact');
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
