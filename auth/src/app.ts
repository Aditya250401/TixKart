import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'

import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import { errorHandler, NotFoundError } from '@aditya250401/common'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
	cookieSession({
		signed: false,
		secure: false, // This must be false in production if you're using HTTP
		sameSite: 'none', 
		domain: 'http://tixkart.bigbeardevs.tech'// Or 'none' if you're doing cross-domain requests
	})
)

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', async (req, res) => {
	throw new NotFoundError()
})

app.use(errorHandler)

export { app }
