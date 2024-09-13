import mongoose from 'mongoose'
import express, { Request, Response } from 'express'
// Importing necessary middleware and utility functions from a common package
// (likely a custom package specific to your application)
import {
	requireAuth, // Middleware to enforce authentication
	validateRequest, // Middleware to validate incoming requests
	NotFoundError, // Custom error class for handling 'not found' scenarios
	OrderStatus, // Enum defining the different statuses an order can have
	BadRequestError, // Custom error class for handling bad request scenarios
} from '@aditya250401/common'
import { body } from 'express-validator' // Middleware for validating the body of the request
import { Ticket } from '../models/ticket' // Ticket model representing the ticket collection in MongoDB
import { Order } from '../models/order' // Order model representing the order collection in MongoDB
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'
import { natsWrapper } from '../nats-wrapper'
// Create an Express router instance
const router = express.Router()

// Define the expiration window for an order (15 minutes)
const EXPIRATION_WINDOW_SECONDS = 15 * 60

/**
 * Route Handler for creating a new order
 *
 * This route will handle incoming POST requests to '/api/orders', allowing
 * authenticated users to place an order for a ticket.
 */
router.post(
	'/api/orders',
	requireAuth, // Ensure the user is authenticated before processing the request
	[
		// Validate the incoming request to ensure a valid ticketId is provided
		body('ticketId')
			.not()
			.isEmpty() // Ensure 'ticketId' is not empty
			.custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // Check if 'ticketId' is a valid MongoDB ObjectId
			.withMessage('TicketId must be provided'), // Custom error message for invalid ticketId
	],
	validateRequest, // Middleware to handle validation errors if any of the above validation fails
	async (req: Request, res: Response) => {
		// Destructure the ticketId from the request body
		const { ticketId } = req.body

		// Step 1: Find the ticket the user is trying to order
		// Use the 'findById' method on the Ticket model to search for the ticket in the database
		const ticket = await Ticket.findById(ticketId)

		// If the ticket is not found, throw a NotFoundError
		if (!ticket) {
			throw new NotFoundError() // This will automatically send a 404 response to the client
		}

		// Step 2: Check if the ticket is already reserved
		// Use a custom instance method 'isReserved' defined in the Ticket model to check if the ticket is already reserved
		const isReserved = await ticket.isReserved()

		// If the ticket is already reserved, throw a BadRequestError
		if (isReserved) {
			throw new BadRequestError('Ticket is already reserved') // Send a 400 error to the client with the relevant message
		}

		// Step 3: Calculate an expiration time for this order
		// Create a new Date object to represent the current time
		const expiration = new Date()

		// Add the expiration window (15 minutes) to the current time
		expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

		// Step 4: Build and save the order to the database
		// Use the static 'build' method on the Order model to create a new order
		// We pass the userId (which comes from the current user's session), status, expiration time, and the ticket object
		const order = Order.build({
			userId: req.currentUser!.id, // 'req.currentUser' is set by the 'requireAuth' middleware
			status: OrderStatus.Created, // Set the status to 'Created'
			expiresAt: expiration, // Set the expiration date we calculated
			ticket, // Associate the order with the ticket being purchased
		})

		// Save the order to the database
		await order.save()

		// Step 5: Publish an event (this is a placeholder comment for where you might implement event publishing)
		// Example: You might want to notify other services that a new order was created (e.g., using an event bus)

		new OrderCreatedPublisher(natsWrapper.client).publish({
			id: order.id,
			version: order.version,
			status: order.status,
			userId: order.userId,
			expiresAt: order.expiresAt.toISOString(),
			ticket: {
				id: ticket.id,
				price: ticket.price,
			},
		})

		// Step 6: Respond to the client
		// Send a response with a 201 status code and the newly created order
		res.status(201).send(order)
	}
)

// Export the router for use in the main application
export { router as newOrderRouter }
