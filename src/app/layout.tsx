import type { Metadata } from 'next';
import "./globals.css";
import { Playfair_Display, DM_Sans } from 'next/font/google';
import Navbar from '@/src/components/Navbar';
import ThemeProvider from '@/src/components/ThemeProvider';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hadarahstore.com.br'),
  title: {
    default: 'Hadarah Store | Moda e Havaianas Personalizadas',
    template: '%s | Hadarah Store',
  },
  description:
    'Descubra a coleção exclusiva Hadarah Store: Havaianas personalizadas e roupas de moda feminina com estilo único.',
  keywords: [
    'havaianas personalizadas',
    'moda feminina',
    'loja de moda',
    'roupas exclusivas',
    'havaianas customizadas',
    'moda brasileira',
    'boutique online',
  ],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Hadarah Store',
    url: 'https://hadarahstore.com.br',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@hadarahstore',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Hadarah Store',
  url: 'https://hadarahstore.com.br',
  logo: 'https://hadarahstore.com.br/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+55-11-99999-9999',
    contactType: 'customer service',
    availableLanguage: 'Portuguese',
  },
  sameAs: [
    'https://www.instagram.com/hadarahstore',
    'https://www.facebook.com/hadarahstore',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="bg-[#FAFAF8] text-[#1A1A1A] font-sans antialiased overflow-x-hidden">
        <ThemeProvider />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
