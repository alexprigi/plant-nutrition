import { localizedMetadata } from '@/lib/metadata';

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return localizedMetadata(params, 'chi-sono');
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
