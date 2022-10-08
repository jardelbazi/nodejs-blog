const express = require('express')
const bcrypt = require('bcryptjs')

const User = require('./User')

const router = express.Router()

router.get('/admin/users/new', (req, res) => res.render('admin/users/new' ))

router.post('/admin/users/save', (req, res) => {
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

router.get('/admin/users/:page?', (req, res) => {
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

module.exports = router