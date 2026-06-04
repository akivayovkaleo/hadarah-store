export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'havaianas' | 'roupas' | 'mercado';
  imageUrl: string;
  imageUrlHover?: string;
  image: string;
  sizes: { [key: string]: number };
  description?: string;
  active: boolean;
  createdAt: string;
}