const Sequelize = require('sequelize')

const connection = new Sequelize('blog', 'root', '', {
	host: 'localhost',
	port: 13306,
	dialect: 'mysql',
	timezone: '-03:00'
})

module.exports = connection