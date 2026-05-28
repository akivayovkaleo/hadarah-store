export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

export type PaymentMethod = 'credit_card' | 'pix' | 'boleto';

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

export interface PaymentData {
  pixQrCode?: string;       // URL da imagem PNG do QR code PIX (PagBank)
  pixQrCodeText?: string;   // String completa do PIX copia-e-cola
  boletoUrl?: string;       // URL do PDF do boleto
  boletoBarcode?: string;   // Linha digitável do boleto
}

export interface CheckoutOrder {
  referenceId: string;
  customer: CustomerData;
  items: OrderItem[];
  address: AddressData;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod | 'credit'; // 'credit' por compatibilidade com o frontend
}

// Documento armazenado no Firestore (leitura — timestamps já convertidos para Date)
export interface StoredOrder {
  id: string;
  referenceId: string;
  status: OrderStatus;
  pagbankOrderId?: string;
  customer: CustomerData;
  items: OrderItem[];
  address: AddressData;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentData?: PaymentData;
  createdAt: Date;
  updatedAt: Date;
}
