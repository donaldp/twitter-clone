const formidable = require('../.formidable/build').default
const supertest = require('supertest')

describe('Application (e2e)', () => {
	let app

	beforeAll(async () => {
		const application = await formidable

		app = application.fastify()

		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('/ (GET: feed)', async () => {
		await supertest(app.server)
			.get('/api/tweets')
			.expect(200)
			.expect((response) => {
				expect(response.body).toEqual(expect.objectContaining({
					data: expect.any(Array)
				}))
			})
	})

	it('/ (GET: timeline) - invalid user', async () => {
		await supertest(app.server)
			.get('/api/tweets/@random')
			.expect(404)
	})

	it('/ (GET: tweet) - invalid tweet', async () => {
		await supertest(app.server)
			.get('/api/tweets/1')
			.expect(404)
	})

	it('/ (PUT: tweet) - unauthenticated', async () => {
		await supertest(app.server)
			.put('/api/tweets')
			.send({ tweet: 'Hello, World!' })
			.expect(401)
	})

	it('/ (POST: login) - invalid', async () => {
		await supertest(app.server)
			.post('/api/login')
			.send({
				username: 'random',
				password: 'password'
			})
			.expect(422)
	})
})
