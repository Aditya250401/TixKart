import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'

import { User } from '../models/user'
import { RequestValidationError } from '@aditya250401/common'
import { BadRequestError } from '@aditya250401/common'

const router = express.Router()

router.post(
	'/api/users/signup',
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('password')
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage('Password must be between 4 and 20 characters'),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			throw new RequestValidationError(errors.array())
		}

		const { email, password } = req.body

		const existingUser = await User.findOne({ email })

		if (existingUser) {
			throw new BadRequestError('Email in use already')
		}

		const user = User.build({ email, password })
		await user.save()

		// Generate JWT
		const userJwt = jwt.sign(
			{
				id: user.id,
				email: user.email,
			},
			process.env.JWT_KEY!
		)

		// Store it on session object
		req.session = {
			jwt: userJwt,
		}

		res.status(201).send(user)
	}
)

export { router as signupRouter }
