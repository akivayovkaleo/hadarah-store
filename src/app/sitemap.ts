import type { MetadataRoute } from 'next';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/src/services/firebase';

const BASE_URL = 'https://hadarahstore.com.br';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const statics: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/colecao`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/colecao/roupas`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/colecao/havaianas`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/sobre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contato`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Dynamic product routes
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const snap = await getDocs(
      query(collection(db, 'products'), where('active', '==', true))
    );
    productEntries = snap.docs.map((d) => ({
      url: `${BASE_URL}/produto/${d.id}`,
      lastModified: new Date((d.data().createdAt as string) || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch {
    // Return statics only if Firestore is unavailable
  }

  return [...statics, ...productEntries];
}
