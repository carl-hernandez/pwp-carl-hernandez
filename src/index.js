require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mailgun = require('mailgun-js')
const bodyParser = require('body-parser')
const {check, validationResult} = require('express-validator')

//initializing express application
const app = express()

//project wide middleware declarations for Express
app.use(morgan('dev'))
app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

const indexRoute = express.Router()

const indexRouteMiddleware = (request, response) => {
	response.json('is this thing on?')
}

const requestValidation =[
	check('email', "A valid email is required").isEmail().normalizeEmail(),
	check('name', "A name is required to send an email").not().isEmpty().trim().escape(),
	check('subject',"subject is required").optional().trim().escape(),
	check('message', 'A message is required to send email').not().isEmpty().trim().escape().isLength({max:2000})

]

indexRoute.route('/apis')
	.get(indexRouteMiddleware)
	.post(requestValidation, (request, response) =>{
		const errors = validationResult(request)

		console.log(request.body)

		if(!errors.isEmpty()) {
			const currentError = errors.array()[0]
			console.log(currentError)
			return response.send(Buffer.from(`<div class ='alert alter-danger' role='alert><strong>Oh snap!</strong> ${currentError.msg}</div>`))
		}
		const {name, email, subject, message} = request.body

		const domain = process.env.MAILGUN_DOMAIN

		const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: domain})

		const mailgunData = {
			to: process.env.MAIL_RECIPIENT,
			from: `Mailgun Sandbox <postmaster@${domain}>`,
			subject: `${name} - ${email}: ${subject}`,
			text: message
		}

		mg.messages().send(mailgunData, (error) =>{
			if (error) {
				response.send(Buffer.from(`
<div class='alert alter-danger' role='alert'><strong>Oh snap!</strong> Unable to send email error with email sender</div>`
				))
			}
		})
		// Line below commented out before hosting
		response.append('Access-Control-Allow-Origin', ['*'])
		response.append('Content-Type', 'text/html')

		return response.send(Buffer.from("<div class='alert alert-success' role='alert'>Email successfully sent.</div>"))

	})
app.use(indexRoute)

app.listen(4200, () => {console.log('The server has started')})

// 	.get((request, response) => {
// 	return response.(Buffer.from(`<div class='alert alter-danger' role='alert'><strong>Oh snap!</strong> ${currentError.msg}</div>`))
// })
// 	.post(requestValidation, (request, response) => {
// 		response.append('Content-type', 'text/html')
//
// 		//the line below must be commented out before pwp has been hosted using docker
// 		response.apped('Access-Control-Allow-Origin', ['*'])
// 		const domain = process.env.MAILGUN_DOMAIN
// 		const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: domain})
//
// 		const {email, subject, name, message} = request.body
//
// 		const mailgunData = {
// 			to: process.env.MAIL_RECIPIENT,
// 			from: `Mailgun Sandbox <postmaster@${domain}>`,
// 			subject: `${name} - ${email}: ${subject}`,
// 			text: message
// 		}
//
// 		mg.messages().send(mailgunData, (error) =>{
// 		if (error) {
// 			response.send(Buffer.from(`
// <div class='alert alter-danger' role='alert'><strong>Oh snap!</strong> Unable to send email error with email sender</div>`
// 			))
// 		}
// 	})
//
//
// 		const errors = validationResult(request)
//
// 		if(!errors.isEmpty()) {
// 		const currentError = errors.()[0]
// 		return response.json(`bad request: ${currentError.msg}`)
// 		}
//
//
// 		return.response.send(Buffer.from("<div class='alert alert-success' role='alert'>Email successfully sent.</div>))
// 	})
//
// app.use(indexRoute)
//
// app.listen(4200, () => {console.log('The server has started')})

		//lines below are used above
		// check('email', "A valid email is required").isEmail().normalizeEmail(),
		// check('name, "A name is required to send an email').not().isEmpty().trim().escape(),
		// check('subject').optional().trim().escape(),
		// check('message', 'A message is required to send email').not().isEmpty().trim().escape().isLength({max:2000})

// 	],
// 		(request, response) => {
//
// 			const domain = process.env.MAILGUN_DOMAIN
// 			const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: domain});
//
// 		const {email, subject, name, message} = request.body
//
// 			const data = {
// 				to: process.env.MAIL_RECIPIENT,
// 				from: `Mailgun Sandbox <postmaster@${domain}>`,
// 				subject: `${name} - ${email}: ${subject}`,
// 				text: message
// 			}
//
// 			mg.messages().send(mailgunData, (error) => {
// 				return response.json('error sending email through email handler please try again')
// 			})
//
// 		const errors= validationResult(request)
//
// 		if(!errors.isEmpty()) {
// 			const currentError = errors.array()[0]
// 			return response.json(`bad request: ${currentError.msg}`)
// 		}
// 		//this line below must be commented out before pwp hosting using docker
// 		response.append('Access-Control-Allow-Origin', ['*'])
// 		console.log(request.body)
// 		return response.send(Buffer.from('<div class='alert alert-success' role='alert'>Email successfully sent.</div>'))
// 	})
//
// app.use(indexRoute)
//
// app.listen(4200, () => {console.log('The server has started')})
//
//
