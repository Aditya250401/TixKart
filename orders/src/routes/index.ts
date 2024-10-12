import express, { Request, Response } from 'express'
import { requireAuth } from '@aditya250401/common'
import { Order } from '../models/order'

const router = express.Router()

// Fetch active orders (excluding 'cancelled' and 'completed' statuses)
router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
	const orders = await Order.find({
		userId: req.currentUser!.id,
		status: {
			$nin: ['cancelled', 'complete'], // Use $nin to exclude multiple statuses
		},
	}).populate('ticket')

	console.log('Orders:', orders)

	res.send(orders)
})

// Fetch completed orders only
router.get(
	'/api/orders/completed',
	requireAuth,
	async (req: Request, res: Response) => {
		const orders = await Order.find({
			userId: req.currentUser!.id,
			status: {
				$eq: 'complete', // Fetch only 'completed' orders
			}, // Fetch only 'completed' orders
		}).populate('ticket')

		console.log('Orders:', orders)

		res.send(orders)
	}
)

export { router as indexOrderRouter }
