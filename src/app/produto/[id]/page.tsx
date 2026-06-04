import type { Metadata } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/src/services/firebase';
import ProdutoClient from './ProdutoClient';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const snap = await getDoc(doc(db, 'products', id));
    if (snap.exists()) {
      const p = snap.data();
      const title = p.name as string;
      const description =
        (p.description as string | undefined) ||
        `Compre ${title} na Hadarah Store. Moda premium com qualidade exclusiva.`;
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          type: 'website',
          images: p.imageUrl ? [{ url: p.imageUrl as string, width: 800, height: 1067 }] : [],
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: p.imageUrl ? [p.imageUrl as string] : [],
        },
      };
    }
  } catch {
    // silent — fallback to default title template
  }
  return { title: 'Produto' };
}

export default async function ProdutoPage({ params }: Props) {
  const { id } = await params;

  // Fetch server-side for JSON-LD structured data
  let jsonLd: object | null = null;
  try {
    const snap = await getDoc(doc(db, 'products', id));
    if (snap.exists()) {
      const p = snap.data();
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: p.name,
        description: p.description || '',
        image: p.imageUrl || p.image || '',
        offers: {
          '@type': 'Offer',
          price: p.price,
          priceCurrency: 'BRL',
          availability: p.active
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          seller: { '@type': 'Organization', name: 'Hadarah Store' },
        },
      };
    }
  } catch {
    // silent
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProdutoClient id={id} />
    </>
  );
}
