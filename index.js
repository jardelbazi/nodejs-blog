const express = require('express')
const bodyParser = require('body-parser')
const connection = require('./configs/connection')

const categoriController = require('./app/categories/CategoryController')
const articleController = require('./app/articles/ArticleController')

const app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

connection
	.authenticate()
	.then(() => console.log("Connection OK"))
	.catch((error) => console.log(error))

app.use('/', categoriController)
app.use('/', articleController)

app.get('/', (req, res) => {
	res.render("index")
})

app.listen(3000, () => console.log("Server rodando!"))