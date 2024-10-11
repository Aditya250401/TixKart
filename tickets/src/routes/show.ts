import express, { Request, Response } from 'express'
import { NotFoundError } from '@aditya250401/common'
import { Ticket } from '../models/ticket'

const router = express.Router()

router.get('/api/ticketsUser', async (req: Request, res: Response) => {
	const tickets = await Ticket.find({
		userId: {
			$eq: req.currentUser!.id,
		},
	})

	res.send(tickets)
})

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
	const ticket = await Ticket.findById(req.params.id)

	if (!ticket) {
		throw new NotFoundError()
	}

	res.send(ticket)
})

export { router as showTicketRouter }
