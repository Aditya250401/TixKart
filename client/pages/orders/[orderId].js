import { useEffect, useState } from 'react'
import axios from 'axios'
import Router from 'next/router'

const OrderShow = () => {

	const [showRazorpay, setShowRazorpay] = useState(false)
	const [orderDetails, setOrderDetails] = useState({
		orderId: null,
		currency: 'INR',
		amount: 0,
	})

	const handleCreateOrder = async () => {
		try {
			const { data } = await axios.post('/api/payments/orders')
			console.log('data mil gaya', data)
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

	const loadScript = (src) =>
		new Promise((resolve) => {
			const script = document.createElement('script')
			script.src = src
			script.onload = () => resolve(true)
			script.onerror = () => resolve(false)
			document.body.appendChild(script)
		})

	const initializeRazorpay = async () => {
		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
		if (!res) {
			console.log('Razorpay SDK failed to load. Are you online?')
			return
		}

		const options = {
			key: 'rzp_test_QBoToAm2STGvXC', // Use your Razorpay key
			amount: orderDetails.amount, // Amount in paise (100 INR = 10000 paise)
			currency: orderDetails.currency,
			name: 'Your Business Name',
			description: 'Payment for your order',
			order_id: orderDetails.orderId, // Razorpay Order ID
			handler: async function (response) {
				const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
					response
				try {
					await axios.post('/api/payments/verify', {
						orderId: order.id,
						paymentId: razorpay_payment_id,
						signature: razorpay_signature,
						razorpay_order_id,
					})
					alert('Payment Successful!')
					Router.push('/orders')
				} catch (error) {
					console.error('Payment verification failed:', error)
					alert('Payment verification failed.')
				}
			},
			prefill: {
				name: currentUser.name,
				email: currentUser.email,
				contact: '8918060957', // Provide a contact number
			},
			theme: {
				color: '#3399cc',
			},
		}

		const rzp1 = new window.Razorpay(options)
		rzp1.open() // Open Razorpay payment window
	}

	useEffect(() => {
		if (showRazorpay) {
			initializeRazorpay()
		}
	}, [showRazorpay])


	return (
		<div>
			<button onClick={handleCreateOrder}>Pay with Razorpay</button>
		</div>
	)
}


export default OrderShow
