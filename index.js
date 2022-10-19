const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const connection = require('./configs/connection')

const categoriController = require('./app/categories/CategoryController')
const articleController = require('./app/articles/ArticleController')
const userController = require('./app/users/UserController')

const Category = require('./app/categories/Category')
const Article = require('./app/articles/Article')
const User = require('./app/users/User')

const app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.use(session({
	secret: 'qualquercoisa',
	cookie: { maxAge: 30000 }
}))

connection
	.authenticate()
	.then(() => console.log("Connection OK"))
	.catch((error) => console.log(error))

app.use('/', categoriController)
app.use('/', articleController)
app.use('/', userController)

app.get('/', (req, res) => {
	Article
		.findAll({
			include: [{ model: Category }],
			order : [
				['id','DESC']
			]
		})
		.then(articles => {
			res.render('index', { articles })
		})
})

app.get('/article/:slug', (req, res) => {
	let slug = req.params.slug
		
	Article
		.findOne({
			include: [{ model: Category }],
			where: {
				slug
			}
		})
		.then(article => {
			if (!article)
				res.redirect('/')

			res.render('articles', { article })
		})
})

app.get('/category/:slug', (req, res) => {
	let slug = req.params.slug
		
	Category
		.findOne({
			where: { slug },
			include: [{ model: Article }]
		})
		.then(category => { 
			if (!category)
				res.redirect('/')

			res.render('index', { category, articles: category.articles })
			
		})
})

app.listen(3000, () => console.log("Server rodando!"))