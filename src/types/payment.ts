export interface PaymentResponse {
  success: boolean;
  status: 'PAID' | 'WAITING' | 'DECLINED' | 'CANCELED' | 'IN_ANALYSIS';
  orderId?: string;
  qrCode?: string;
  qrCodeText?: string;
  boletoUrl?: string;
  message?: string;
}
