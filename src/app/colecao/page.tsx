import type { Metadata } from 'next';
import ColecaoPage from './ColecaoClient';

export const metadata: Metadata = {
  title: 'Coleção',
  description:
    'Explore toda a coleção Hadarah Store: Havaianas personalizadas e roupas de moda feminina exclusivas.',
};

export default function Page() {
  return <ColecaoPage />;
}
