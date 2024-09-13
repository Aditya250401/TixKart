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
import { Payment } from '../models/payment'
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher'
import { natsWrapper } from '../nats-wrapper'
import Razorpay from 'razorpay'

const router = express.Router()

const razorpay = new Razorpay({
	key_id: 'rzp_test_XKTJYBPsUb9pgK',
	key_secret: 'pVNItRkQiMU3aXFvheKUuZ6b',
})

router.post(
	'/api/payments',
	requireAuth,
	[body('orderId').not().isEmpty()],
	validateRequest,
	async (req: Request, res: Response) => {
		const { orderId } = req.body

		const order = await Order.findById(orderId)
		console.log('order recieved', order)

		if (!order) {
			throw new NotFoundError()
		}

		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError()
		}

		if (order.status === OrderStatus.Cancelled) {
			throw new BadRequestError('Cannot pay for a cancelled order')
		}

		const amount = order.price * 100 // Amount in paise

		const receiptId = `receipt_${order.id}`

		const paymentOrder = await razorpay.orders.create({
			amount,
			currency: 'INR',
			receipt: receiptId,
		})

		const payment = Payment.build({
			orderId,
			stripeId: paymentOrder.id,
		})

		console.log('this is the payment', payment)

		await payment.save()

		new PaymentCreatedPublisher(natsWrapper.client).publish({
			id: payment.id,
			orderId: payment.orderId,
			stripeId: payment.stripeId,
		})

		res.status(201).send({
			amount,
			razorpayOrderId: paymentOrder.id,
		})
	}
)

export { router as createChargeRouter }
