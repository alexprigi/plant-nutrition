import { alternatesFor } from '@/lib/metadata';
import HomeContent from './home-content';

// Il contenuto della home è un componente client: qui restano i metadati (canonical e hreflang)
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { alternates: alternatesFor(locale, '') };
}

export default function Home() {
  return <HomeContent />;
}
