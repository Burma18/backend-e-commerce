export class PaymentUpdateDto {
  update_id: number; // Unique ID for the payment update
  invoice_payload: string; // The payload containing data (such as userId)
  amount: number; // Amount paid
  currency: string; // Currency type, e.g., USDT
}
