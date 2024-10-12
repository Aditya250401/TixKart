import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
	requireAuth,
	validateRequest,
	BadRequestError,
	NotAuthorizedError,
	NotFoundError,
	OrderStatus,
} from '@aditya250401/common'
import { Order } from '../models/order'
import Razorpay from 'razorpay'

const router = express.Router()

const razorpay = new Razorpay({
	key_id: 'rzp_test_QBoToAm2STGvXC',
	key_secret: process.env.RAZORPAY_SECRET,
})

// router.post(
// 	'/api/payments',
// 	requireAuth,
// 	[body('orderId').not().isEmpty()],
// 	validateRequest,
// 	async (req: Request, res: Response) => {
// 		const { orderId } = req.body

// 		const order = await Order.findById(orderId)

// 		if (!order) {
// 			throw new NotFoundError()
// 		}

// 		if (order.userId !== req.currentUser!.id) {
// 			throw new NotAuthorizedError()
// 		}

// 		if (order.status === OrderStatus.Cancelled) {
// 			throw new BadRequestError('Cannot pay for a cancelled order try again')
// 		}

// 		const amount = order.price * 100 // Amount in paise

// 		const receiptId = `receipt_${order.id}`

// 		const paymentOrder = await razorpay.orders.create({
// 			amount,
// 			currency: 'INR',
// 			receipt: receiptId,
// 		})

// 		res.status(201).send({
// 			amount,
// 			razorpayOrderId: paymentOrder.id,
// 		})
// 	}
// )

router.post('/api/payments', async (req: Request, res: Response) => {
	const { orderIds } = req.body

	// Find all orders belonging to the current user and are not cancelled
	const orders = await Order.find({
		_id: { $in: orderIds },
		userId: req.currentUser!.id,
		status: { $ne: OrderStatus.Cancelled },
	})

	if (orders.length === 0) {
		throw new NotFoundError()
	}

	// Calculate the total price for all orders
	const subtotal = orders.reduce((acc, order) => acc + order.price, 0) * 100

	const serviceFee = 20.0
	const tax = subtotal * 0.1
	const totalAmount = subtotal + serviceFee + tax // Amount in paise

	const generateRandomString = (length: number) => {
		const characters =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
		let result = ''
		const charactersLength = characters.length
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength))
		}
		return result
	}

	const randomString = generateRandomString(20)
	// Create a single Razorpay order for the total amount
	const receiptId = `receipt_${randomString}`

	const paymentOrder = await razorpay.orders.create({
		amount: totalAmount,
		currency: 'INR',
		receipt: receiptId,
	})

	res.status(201).send({
		amount: totalAmount,
		currency: 'INR',
		razorpayOrderId: paymentOrder.id,
	})
})

export { router as createChargeRouter }
