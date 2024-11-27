import type { PaymentHistoryResponse } from './payment'
import request from './request'

export enum PayoutStatus {
  process = 'process',
  paid = 'paid',
  fail = 'fail',
}

export interface CreatePayoutParams {
  amount: string
  currency: string
  order_id: string
  callback_url: string
  network: string
  address: string
  /** 付款货币，只能是数字货币；若 currency 为法币，该字段必传 */
  pay_currency?: string
  additional_data?: string
  /**
   * 是否用户承担手续费，默认为 false
   *
   * 比如商户的费率为 1%，商户创建 100 USDT 的订单手续费为 1 USDT，如果这时该字段值为 true（表示用户来承担手续费），那么用户最终收到 99 USDT
   */
  is_fee_paid_by_receiver?: boolean
}
export interface CreatePayoutResponse {
  amount: string
  currency: string
  order_id: string
  network: string
  address: string
  payout_id: string
  status: PayoutStatus
  pay_currency: string
  pay_amount: string
  additional_data: string | null
}
export const createPayout = (params: CreatePayoutParams) => request.post<CreatePayoutResponse>('/gateway/payout', params)

export interface CreatePayoutWebhookCallback {
  amount: string
  currency: string
  order_id: string
  network: string
  address: string
  payout_id: string
  status: PayoutStatus
  pay_currency: string
  pay_amount: string
  additional_data: string | null
  txid: string
  fee: string
  /** 支付时间戳 */
  pay_at: number
}

export interface PayoutHistory {
  start_time: number
  end_time: number
  order_number?: string
}
export type PayoutHistoryResponse = Omit<PaymentHistoryResponse, 'results'> & {
  results: CreatePayoutWebhookCallback[]
}
export const getPayoutHistory = (params: PayoutHistory) => request.post<PayoutHistoryResponse>('/gateway/payout/list', params)
