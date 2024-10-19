export class UpdateInvoiceDto {
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
