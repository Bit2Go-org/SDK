import request from './request'

export enum PaymentStatus {
  unpaid = 'unpaid',
  paid = 'paid',
  paid_over = 'paid_over',
  partial_payment = 'partial_payment',
  cancel = 'cancel',
}

export interface Currency {
  currency: string
  network?: string
}

export type CreateInvoiceParams = {
  amount: string
  /** 订单货币；可以是法币和数字货币 */
  currency: string
  order_id: string
  /** 当订单成功时或过期时，系统将发送通知给该地址 */
  callback_url: string
} & Partial<{
  cancel_url: string
  success_url: string
  /** 商户自定义数据，异步通知会包含该数据 */
  additional_data: string
  pay_currency: string
  /**
   *折扣或额外手续费的百分比： -99 ~ 100， 默认为 0；数值为正数时，为折扣；数值为负数时，为额外的手续费
   *
   *比如该字段值为 10，表示用户享受 10% 的折扣，商户创建 100 USDT 的订单，用户只需要支付 90 USDT，订单就会是 paid 状态
   *
   *比如该字段值为 -10，表示用户需要支付额外 10% 手续费，商户创建 100 USDT 的订单，用户需要支付 110 USDT，订单才会是 paid 状态
   *
   *用户实际付款的金额将添加进商户余额中
   */
  discount_percent: number
  /** 订单的有效期，单位为秒：300 ~ 43200，默认为 3600 */
  lifetime: number
  /**
   * 用户承担手续费的比例：0 ~ 100，默认为 0
   *
   * 比如商户的费率为 1%，商户创建 100 USDT 的订单手续费为 1 USDT，如果这时该字段值为 100（表示用户将支付 100% 的手续费），那么用户最终需要支付 101 USDT
   */
  percent_fee_paid_by_user: number
  /**
   * 支付准确率： 0.00 ~ 10.00， 默认为 0
   *
   * 比如该字段值为 5，那表示用户实际支付的金额只要在订单金额的 95% ~ 100% 订单都会是 paid 状态
   *
   * 用户实际付款的金额将添加进商户余额中
   */
  accuracy_payment_percent: number
  /** 指定用户支付时可使用的数字货币 */
  currencies: Currency[]
  /** 指定用户支付时不可使用的数字货币 */
  except_currencies: Currency[]
}>
export interface CreateInvoiceResponse {
  amount: string
  currency: string
  order_id: string
  additional_data: string | null
  /** 折扣或额外手续费的百分比 */
  discount_percent: string
  /** Bit2Go 订单ID */
  payment_id: string
  status: PaymentStatus
  pay_currency: string
  pay_amount: string
  /** 折扣或者额外的手续费 */
  discount: string
  /** 支付收银台链接 */
  payurl: string
  /** 订单过期时间戳 */
  expired_at: number
  address: string
  network: string
}
/** 创建数字货币收单、发票或链接支付 */
export const createInvoice = (params: CreateInvoiceParams) => request.post<CreateInvoiceResponse>('/gateway/payment', params)

export interface CreateStaticWalletParams {
  networks: string[]
  customer_id: string
  callback_url: string
  /**
   * 法币货币，默认为 USD
   *
   * 异步通知中，Bit2Go 会将收到的数字资产按照最新汇率转换成该法币
   */
  fiat_currency?: string
}
export type CreateStaticWalletResponse = {
  address: string
  networks: string
}[]
/** 给用户创建静态钱包，Bit2Go 收到数字资产后，将通过异步通知地址通知商户 */
export const createStaticWallet = (params: CreateStaticWalletParams) => request.post<CreateStaticWalletResponse>('/gateway/static/wallet', params)

export interface CreateInvoiceWebhookCallback {
  amount: string
  currency: string
  order_id: string
  additional_data: string | null
  discount_percent: string
  payment_id: string
  status: PaymentStatus
  pay_currency: string
  pay_amount: string
  network: string
  discount: string
  /** 交易Hash */
  txid: string
  fee: string
  paid_at: number
  expired_at: number
  /** 支付金额自动转换成指定币种 */
  convert: {
    /** 目标币种，默认为 USDT */
    to_currency: string
    /** 转化后的金额 */
    amount_received: string
    fee: string
    fee_currency: string
    rate: string
  }
  /** 支付金额对应的等价法币 */
  pay_amount_in_fiat: {
    fiat_currency: string
    fiat_amount: string
    rate: string
  }
  /** 支付金额对应的等价USDT */
  pay_amount_in_usdt: {
    /** 默认为 USDT */
    to_currency: string
    usdt_amount: string
    rate: string
  }
}

export interface PaymentHistoryParams {
  start_time: number
  end_time: number
  order_number?: string
}
export interface PaymentHistoryResponse {
  count: number
  // ?
  next: null
  // ?
  previous: null
  page_size: number
  page: number
  results: CreateInvoiceWebhookCallback[]
}
export const getPaymentHistory = (params: PaymentHistoryParams) => request.post<PaymentHistoryResponse>('/gateway/payment/list', params)
