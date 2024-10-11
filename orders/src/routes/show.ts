import express, { Request, Response } from 'express'
import {
	requireAuth,
	NotFoundError,
	NotAuthorizedError,
} from '@aditya250401/common'
import { Order } from '../models/order'

const router = express.Router()

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
	const orders = await Order.find({
		userId: req.currentUser!.id,
		expiresAt: { $gt: new Date() }, // Filter to find orders where expiresAt is greater than the current date
	}).populate('ticket')

	res.send(orders)
})

router.get(
	'/api/orders/:orderId',
	requireAuth,
	async (req: Request, res: Response) => {
		const order = await Order.findById(req.params.orderId).populate('ticket')

		if (!order) {
			throw new NotFoundError()
		}
		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError()
		}

		res.send(order)
	}
)

export { router as showOrderRouter }
