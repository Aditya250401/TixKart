import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a Payment interface (if needed)
export interface PaymentResponse {
	orderIds: (string | undefined)[] | undefined
	amount: number
	razorpayOrderId: string
	currency: string
}

export interface VerifyPaymentData {
	orderIds: (string | undefined)[] | undefined
	paymentId: string
	signature: string
	razorpay_order_id: string
}

const paymentApi = createApi({
	reducerPath: 'paymentApi',
	baseQuery: fetchBaseQuery({
		baseUrl: '/',
		credentials: 'include', // To include cookies
		mode: 'cors',
	}),
	endpoints(builder) {
		return {
			// Create Razorpay order for multiple user orders (cart payment)
			createPaymentOrder: builder.mutation({
				query: (paymentData) => ({
					url: '/api/payments/',
					method: 'POST',
					body: paymentData,
				}),
			}),

			// Verify Razorpay payment
			verifyPayment: builder.mutation<void, VerifyPaymentData>({
				query: (verificationData) => ({
					url: '/api/payments/verify',
					method: 'POST',
					body: verificationData,
				}),
			}),
		}
	},
})

export const { useCreatePaymentOrderMutation, useVerifyPaymentMutation } =
	paymentApi

export { paymentApi }
