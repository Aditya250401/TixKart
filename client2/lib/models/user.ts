import * as z from 'zod'

export const UserValidation = z.object({
	email: z.string().email('Invalid email').min(1, 'Email is required'),
	password: z.string().min(4).optional(),
})

export const UserLoginValidation = z.object({
	email: z.string().email('Invalid email').min(1, 'Email is required'),
	password: z.string().min(4),
})
