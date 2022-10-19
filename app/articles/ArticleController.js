const express = require('express')
const slugify = require('slugify')

const Article = require('./Article')
const Category = require('../categories/Category')
const adminAuth = require('../../middlewares/AdminAuth')

const router = express.Router()

router.get('/admin/articles/new', adminAuth, (req, res) => {
	Category
		.findAll().then(categories => {
			res.render('admin/articles/new', { categories })
		})
})

router.post('/admin/articles/save', adminAuth, (req, res) => {
	let title = req.body.title
	let categoryId = req.body.categoryId
	let description = req.body.description

	Article
		.create({ 
			title,
			slug: slugify(title, { lower: true }),
			categoryId,
			description
		})
		.then(() => res.redirect('/admin/articles'))
})

router.get('/admin/articles/delete/:id', adminAuth, (req, res) => {
	let id = req.params.id

	if (isNaN(id))
		res.redirect('/admin/articles')

	Article
		.destroy({
			where: { id }
		})
		.then(() => res.redirect('/admin/articles'))
})

router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
	let id = req.params.id

	if (isNaN(id))
		res.redirect('/admin/articles')
		
	Article
		.findByPk(id)
		.then(article => {
			if (!article)
				res.redirect('/admin/articles')

			Category
				.findAll()
				.then(categories => {
					res.render('admin/articles/edit', { article,  categories})
				})
		})
})

router.post('/admin/articles/update/:id', adminAuth, (req, res) => {
	let id = req.params.id
	let title = req.body.title
	let categoryId = req.body.categoryId
	let description = req.body.description

	if (isNaN(id))
		res.redirect('/admin/articles')

	Article
		.update({ 
			title,
			slug: slugify(title, { lower: true }),
			categoryId,
			description
		},{ 
			where: { id }
		})
		.then(() => res.redirect('/admin/articles'))
})

router.get('/admin/articles/:page?', adminAuth, (req, res) => {
	let page = req.params.page != undefined ? parseInt(req.params.page) : 1
	let limit = 2
	let offset = page > 1 ? (page - 1) * limit : 0

	Article
		.findAndCountAll({
			include: [{ model: Category }],
			order: [
				['id','Desc']
			],
			offset,
			limit
		})
		.then(articles => {
			let next = offset + limit < articles.count ?? false
			let result = { next, articles, page }

			res.render('admin/articles/index', { result })
		})
})

module.exports = router