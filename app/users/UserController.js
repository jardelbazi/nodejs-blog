const express = require('express')
const bcrypt = require('bcryptjs')

const User = require('./User')
const adminAuth = require('../../middlewares/AdminAuth')

const router = express.Router()

router.get('/admin/users/new', adminAuth, (req, res) => res.render('admin/users/new' ))

router.post('/admin/users/save', adminAuth, (req, res) => {
	let name = req.body.name
	let email = req.body.email
	let password = req.body.password

	User
		.findOne({ where: { email }})
		.then(user => {
			if (!user) {
				let salt = bcrypt.genSaltSync(15)
				let hash = bcrypt.hashSync(password, salt)
			
				User.
					create({
						name,
						email,
						password: hash
					})
					.then(() => res.redirect('/admin/users'))
			} else 
				res.redirect('/admin/users/new')
		})
})

router.get('/admin/users/:page?', adminAuth, (req, res) => {
	let page = req.params.page != undefined ? parseInt(req.params.page) : 1
	let limit = 2
	let offset = page > 1 ? (page - 1) * limit : 0

	User
		.findAndCountAll({
			order: [
				['id','Desc']
			],
			offset,
			limit
		})
		.then(users => {
			let next = offset + limit < users.count ?? false
			let result = { next, users, page }

			res.render('admin/users/index', { result })
		})
})

router.get('/login', (req, res) => res.render('admin/users/login'))

router.post('/authenticate', (req, res) => {
	let email = req.body.email
	let password = req.body.password

	User
		.findOne({
			where: { email }
		})
		.then(user => {
			if (!user)
				res.redirect('/login')

			let isCorrect = bcrypt.compareSync(password, user.password)

			if (isCorrect) {
				req.session.user = {
					id: user.id,
					email: user.email
				}

				res.redirect('/admin/articles')
			}
			else
				res.redirect('/login')
		})
})

router.get('/logout', (req, res) => {
	req.session.user = undefined
	res.redirect('/')
})

module.exports = router