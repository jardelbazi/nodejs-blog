function adminAuth(req, res, next) {
	if (req.session.user == undefined)
		res.redirect('/login')
		
	next();
}

module.exports = adminAuth