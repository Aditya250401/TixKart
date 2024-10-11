import express, { Request, Response } from 'express'
import { Ticket } from '../models/ticket'
import { requireAuth } from '@aditya250401/common'
import mongoose from 'mongoose'

const router = express.Router()

router.get('/api/tickets', async (req: Request, res: Response) => {
	const tickets = await Ticket.find({
		orderId: undefined,
	})

	res.send(tickets)
})


export { router as indexTicketRouter }
