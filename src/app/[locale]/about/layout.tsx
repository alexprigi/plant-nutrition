import { localizedMetadata } from '@/lib/metadata';

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return localizedMetadata(params, 'chi-sono', {}, '/about');
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
