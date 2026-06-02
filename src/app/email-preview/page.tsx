'use client';

import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const EmailPreviewClient = dynamic(() => import('./EmailPreviewClient'), { ssr: false });

export default function EmailPreviewPage() {
  if (process.env.NODE_ENV !== 'development') notFound();
  return <EmailPreviewClient />;
}
