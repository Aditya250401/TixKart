import request from 'supertest'
import { app } from '../../app'

it('clears the cookie after signing out', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.com',
			password: 'password',
		})
		.expect(201)

	const response = await request(app)
		.post('/api/users/signout')
		.send({})
		.expect(200)

	const cookies = response.get('Set-Cookie')
	expect(cookies).toBeDefined() // Check if the cookies array is defined

	if (cookies){
			expect(cookies[0]).toContain('session=;')
			expect(cookies[0]).toContain('expires=Thu, 01 Jan 1970 00:00:00 GMT')
			expect(cookies[0]).toContain('path=/')
			expect(cookies[0]).toContain('httponly')
		}


})
