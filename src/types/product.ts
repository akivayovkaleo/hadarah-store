export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'havaianas' | 'roupas';
  imageUrl: string;
  sizes: { [key: string]: number }; // Ex: { "37-38": 5, "M": 2 }
  description?: string;
  active: boolean;
  createdAt: string;
}