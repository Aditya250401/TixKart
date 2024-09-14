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
import crypto from 'crypto'

const router = express.Router()

const razorpayKeySecret = process.env.RAZORPAY_SECRET! // Use your actual Razorpay key secret here

router.post(
	'/api/payments/verify',
	requireAuth,
	[
		body('orderId').not().isEmpty(),
		body('paymentId').not().isEmpty(),
		body('signature').not().isEmpty(),
		body('razorpay_order_id').not().isEmpty(),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { orderId, paymentId, signature, razorpay_order_id } = req.body

		// Retrieve order and check validity
		const order = await Order.findById(orderId)


		if (!order) {
			throw new NotFoundError()
		}

		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError()
		}

		if (order.status === OrderStatus.Cancelled) {
			throw new BadRequestError('Cannot pay for a cancelled order')
		}

		// Generate the signature

		const generatedSignature = crypto
			.createHmac('sha256', razorpayKeySecret)
			.update(`${razorpay_order_id}|${paymentId}`) // Note the concatenation order
			.digest('hex')


		// Step 3: Compare the generated signature with the signature received from Razorpay
		if (generatedSignature === signature) {
			// Signature is valid, process the payment
			const payment = Payment.build({
				orderId,
				paymentId,
			})

			await payment.save()

			new PaymentCreatedPublisher(natsWrapper.client).publish({
				id: payment.id,
				orderId: payment.orderId,
				paymentId: payment.paymentId,
			})

			res.status(201).send({
				paymentId,
			})
		} else {
			// Signature is invalid
			res.status(400).send('Invalid signature')
		}
	}
)

export { router as verifyChargeRouter }
