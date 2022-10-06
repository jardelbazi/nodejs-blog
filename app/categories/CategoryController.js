const express = require('express')
const slugify = require('slugify')
const Category = require('./Category')

const router = express.Router()

router.get('/admin/categories', (req, res) => {
	Category.findAll().then(categories => {
		res.render('admin/categories/index', { categories })
	})
})

router.get('/admin/categories/new', (req, res) => res.render('admin/categories/new'))

router.post('/admin/categories/save', (req, res) => {
	let title = req.body.title

	Category.create({ 
		title,
		slug: slugify(title, { lower: true })
	}).then(() => res.redirect('/admin/categories'))
})

router.get('/admin/categories/delete/:id', (req, res) => {
	let id = req.params.id

	if (isNaN(id))
		res.redirect('/admin/categories')

	Category.destroy({
		where: { id }
	}).then(() => res.redirect('/admin/categories'))
})

router.get('/admin/categories/edit/:id', (req, res) => {
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

router.post('/admin/categories/update/:id', (req, res) => {
	let id = req.params.id
	let title = req.body.title

	if (isNaN(id))
		res.redirect('/admin/categories')

	Category
		.update({title, slug: slugify(title, { lower: true })},{ 
			where: { id }
		}).then(() => res.redirect('/admin/categories'))
})

module.exports = router