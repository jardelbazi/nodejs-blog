const express = require('express')
const slugify = require('slugify')
const Category = require('./Category')
const adminAuth = require('../../middlewares/AdminAuth')

const router = express.Router()

router.get('/admin/categories/new', adminAuth, (req, res) => res.render('admin/categories/new'))

router.post('/admin/categories/save', (req, res) => {
	let title = req.body.title

	Category.create({ 
		title,
		slug: slugify(title, { lower: true })
	}).then(() => res.redirect('/admin/categories'))
})

router.get('/admin/categories/delete/:id', adminAuth, (req, res) => {
	let id = req.params.id

	if (isNaN(id))
		res.redirect('/admin/categories')

	Category.destroy({
		where: { id }
	}).then(() => res.redirect('/admin/categories'))
})

router.get('/admin/categories/edit/:id', adminAuth, (req, res) => {
	let id = req.params.id

	if (isNaN(id))
		res.redirect('/admin/categories')
		
	Category
		.findByPk(id)
		.then(category => {
			if (!category)
				res.redirect('/admin/categories')

			res.render('admin/categories/edit', { category })
		})
})

router.post('/admin/categories/update/:id', adminAuth, (req, res) => {
	let id = req.params.id
	let title = req.body.title

	if (isNaN(id))
		res.redirect('/admin/categories')

	Category
		.update({title, slug: slugify(title, { lower: true })},{ 
			where: { id }
		}).then(() => res.redirect('/admin/categories'))
})

router.get('/admin/categories/:page?', adminAuth, (req, res) => {
	let page = req.params.page != undefined ? parseInt(req.params.page) : 1
	let limit = 2
	let offset = page > 1 ? page * limit : 0
	
	Category
		.findAndCountAll({
			order: [
				['id','Desc']
			],
			offset,
			limit
		})
		.then(categories => {
			let next = offset + limit < categories.count ?? false
			let result = { next, categories, page }

			res.render('admin/categories/index', { result })
		})
})

module.exports = router