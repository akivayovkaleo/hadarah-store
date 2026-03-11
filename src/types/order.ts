export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  size?: string;
}

export interface CustomerData {
  name: string;
  email: string;
  taxId: string;
  phone: string;
}

export interface AddressData {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface CheckoutOrder {
  referenceId: string;
  customer: CustomerData;
  items: OrderItem[];
  address: AddressData;
  shipping: number;
  total: number;
  paymentMethod: 'credit_card' | 'pix' | 'boleto';
}
