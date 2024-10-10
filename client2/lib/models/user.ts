import * as z from 'zod'

export const UserValidation = z.object({
	email: z.string().email('Invalid email').min(1, 'Email is required'),
	password: z.string().min(4).optional(),
})

export const UserLoginValidation = z.object({
	email: z.string().email('Invalid email').min(1, 'Email is required'),
	password: z.string().min(4),
})

export const TicketCreate = z.object({
	title: z.string().min(3, 'ticket title is required'),
	price: z.number(),
})
