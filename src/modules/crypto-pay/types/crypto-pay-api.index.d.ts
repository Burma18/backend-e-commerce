declare module '@foile/crypto-pay-api' {
  // The structure of an invoice
  interface Invoice {
    invoice_id: number;
    currency_type: string;
    asset: string;
    amount: string;
    pay_url: string;
    status: string;
    bot_invoice_url: string;
    mini_app_invoice_url: string;
    web_app_invoice_url: string;
    created_at: string;
    payload?: string; // This will store additional information like userId
  }

  // The structure of a payment update that comes from the webhook
  interface PaymentUpdate {
    update_id: number;
    update_type: string;
    request_date: string;
    payload: {
      invoice_id: number;
      hash: string;
      currency_type: string;
      asset: string;
      amount: string;
      paid_asset: string;
      paid_amount: string;
      fee_asset: string;
      fee_amount: string;
      fee: string;
      fee_in_usd: string;
      pay_url: string;
      bot_invoice_url: string;
      mini_app_invoice_url: string;
      web_app_invoice_url: string;
      description: string;
      status: string;
      created_at: string;
      allow_comments: boolean;
      allow_anonymous: boolean;
      paid_usd_rate: string;
      usd_rate: string;
      paid_at: string;
      paid_anonymously: boolean;
      payload: string;
    };
  }

  // Information about the CryptoPay application
  interface AppInfo {
    app_id: number;
    name: string;
    payment_processing_enabled: boolean;
  }

  // Extending the CryptoPay class for interacting with the API
  class CryptoPay {
    constructor(token: string, config?: { hostname: string; protocol: string });

    // Method to create an invoice with optional description and payload
    createInvoice(
      currency: string,
      amount: number,
      options?: { description?: string; payload?: string },
    ): Promise<Invoice>;

    // Method to get the application information
    getMe(): Promise<AppInfo>;
  }

  // Exporting types for use in your application
  export { CryptoPay, Invoice, PaymentUpdate, AppInfo };
}
