import express from 'express'
import { currentUser } from '@aditya250401/common'

const router = express.Router()

router.get('/api/users/currentuser', currentUser, (req, res) => {
	console.log('things went alright')
	res.send({ currentUser: req.currentUser || null })
})

export { router as currentUserRouter }
