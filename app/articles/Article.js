const Sequelize = require('sequelize')
const connection = require('../../configs/connection')

const Category = require('../categories/Category')

const Article = connection.define('articles', {
	title: {
		type: Sequelize.STRING,
		allowNull: false
	},
	slug: {
		type: Sequelize.STRING,
		allowNull: false
	},
	description: {
		type: Sequelize.STRING,
		allowNull: false
	}
})

Category.hasMany(Article)
Article.belongsTo(Category)

Article.sync({force: false})

module.exports = Article