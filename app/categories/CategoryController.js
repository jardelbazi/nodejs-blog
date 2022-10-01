const express = require('express')
const router = express.Router()
const slugify = require('slugify')

const Category = require('./Category')

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

module.exports = router