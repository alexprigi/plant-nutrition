'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import CookieBanner from '@/components/CookieBanner';
import ChatWidget from '@/components/ChatWidget';

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Header />
      <main className="pt-[68px]">{children}</main>
      <Footer />
      <CookieBanner />
      <ChatWidget />
    </>
  );
}
