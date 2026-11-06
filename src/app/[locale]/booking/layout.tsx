import { localizedMetadata } from '@/lib/metadata';

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return localizedMetadata(params, 'prenota', {}, '/booking');
}

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
