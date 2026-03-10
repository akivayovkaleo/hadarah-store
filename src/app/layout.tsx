import "./globals.css";
import { Playfair_Display, Inter } from 'next/font/google';
import LuxuryCursor from '@/src/components/LuxuryCursor';
import Navbar from '@/src/components/Navbar';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

export const metadata = {
  title: 'Hadarah Store | Adornada com beleza',
  description: 'Boutique exclusiva de roupas de elite, joias e havaianas premium.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-[#0F0F0F] text-white font-sans antialiased">
        <LuxuryCursor />
        <Navbar />
        {children}
      </body>
    </html>
  );
}