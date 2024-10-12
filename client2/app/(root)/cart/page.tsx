'use client'

import Image from 'next/image'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
	useGetOrdersQuery,
	useCreatePaymentOrderMutation,
	useVerifyPaymentMutation,
} from '@/lib/redux/store'
import { useState, useEffect } from 'react'
import Router from 'next/router'

export default function Component() {
	const { data: orders, error, isLoading } = useGetOrdersQuery()
    const orderIds = orders?.map((order) => order.id)


	const [createPaymentOrder] = useCreatePaymentOrderMutation()
	const [verifyPayment] = useVerifyPaymentMutation()
	const [showRazorpay, setShowRazorpay] = useState(false)
	const [orderDetails, setOrderDetails] = useState({
		orderId: null,
		currency: 'INR',
		amount: 0,
	})

	// Razorpay script loader
	const loadScript = (src) =>
		new Promise((resolve) => {
			const script = document.createElement('script')
			script.src = src
			script.onload = () => resolve(true)
			script.onerror = () => resolve(false)
			document.body.appendChild(script)
		})

	// Function to initialize Razorpay
	const initializeRazorpay = async () => {
		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
		if (!res) {
			console.log('Razorpay SDK failed to load. Are you online?')
			return
		}

		const options = {
			key: 'rzp_test_QBoToAm2STGvXC', // Use your Razorpay key
			amount: orderDetails.amount, // Amount in paise
			currency: orderDetails.currency,
			name: 'Your Business Name',
			description: 'Payment for your order',
			order_id: orderDetails.orderId, // Razorpay Order ID
			handler: async function (response) {
				const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
					response
				try {
					await verifyPayment({
						orderIds,
						paymentId: razorpay_payment_id,
						signature: razorpay_signature,
						razorpay_order_id,
					}).unwrap()
					alert('Payment Successful!')
					Router.push('/orders')
				} catch (error) {
					console.error('Payment verification failed:', error)
					alert('Payment verification failed.')
				}
			},
			prefill: {
				name: 'Your Name',
				email: 'your-email@example.com',
				contact: '8918060957',
			},
			theme: {
				color: '#3399cc',
			},
		}

		const rzp1 = new window.Razorpay(options)
		rzp1.open() // Open Razorpay payment window
	}

	// Function to create Razorpay order
	const handleCreateOrder = async () => {
		try {
			const { data } = await createPaymentOrder({ orderIds })

			setOrderDetails({
				orderId: data.razorpayOrderId,
				currency: 'INR',
				amount: data.amount,
			})
			setShowRazorpay(true)
		} catch (error) {
			console.error('Failed to create order:', error)
		}
	}

	// Trigger Razorpay when ready
	useEffect(() => {
		if (showRazorpay) {
			initializeRazorpay()
		}
	}, [showRazorpay])

	// UI rendering remains same as before

	// Calculating subtotal, tax, and total
	const subtotal =
		orders?.reduce((sum, order) => sum + order.ticket.price, 0) || 0
	const serviceFee = 20.0
	const tax = subtotal * 0.1
	const total = subtotal + serviceFee + tax

	if (isLoading) return <p>Loading...</p>
	if (error) return <p>Error loading orders</p>

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-100 flex flex-col items-center justify-start p-4 relative overflow-hidden">
			<div className="absolute inset-0 z-0">
				<Image
					src="/placeholder.svg"
					alt="Blurred background"
					layout="fill"
					objectFit="cover"
					className="opacity-10 blur-sm"
				/>
			</div>
			<div className="w-full max-w-6xl text-center mb-8 relative z-10">
				<h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
					Your Cosmic Cart
				</h1>
				<p className="text-xl md:text-2xl font-medium text-teal-300">
					Review and confirm your stellar selections
				</p>
			</div>
			<Card className="w-full max-w-4xl bg-gray-800/50 backdrop-blur-md border-gray-700 text-gray-100 shadow-2xl relative z-10">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-teal-300 flex items-center">
						<ShoppingCart className="mr-2" />
						Shopping Cart
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						{orders &&
							orders.map((order) => (
								<div
									key={order.id}
									className="flex items-center justify-between"
								>
									<div className="flex-1">
										<h3 className="text-lg font-semibold text-gray-200">
											{order.ticket.title}
										</h3>
										<p className="text-sm text-gray-400">
											${order.ticket.price.toFixed(2)} each
										</p>
									</div>
									<div className="flex items-center space-x-2">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleDelete(order.id)}
											className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-transparent"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>
							))}
					</div>
					<Separator className="my-6 bg-gray-700" />
					<div className="space-y-4">
						<div className="flex justify-between text-gray-300">
							<span>Subtotal</span>
							<span>${subtotal.toFixed(2)}</span>
						</div>
						<div className="flex justify-between text-gray-300">
							<span>Service Fee</span>
							<span>${serviceFee.toFixed(2)}</span>
						</div>
						<div className="flex justify-between text-gray-300">
							<span>Estimated Tax</span>
							<span>${tax.toFixed(2)}</span>
						</div>
						<Separator className="my-2 bg-gray-700" />
						<div className="flex justify-between text-lg font-semibold">
							<span className="text-gray-100">Total</span>
							<span className="text-teal-300">${total.toFixed(2)}</span>
						</div>
					</div>
					<div className="mt-8">
						<Button
							className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white text-lg py-6 rounded-full transition-all duration-300 transform hover:scale-105"
							size="lg"
							onClick={handleCreateOrder} // Trigger order creation and payment
						>
							Proceed to Checkout
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
