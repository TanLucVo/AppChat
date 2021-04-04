var express = require('express');
var router = express.Router();
const passport = require('passport');
const { generateAccessToken } = require('../config/token');
const { ensureGuest } = require('../middleware/auth');
/* GET users listing. */
router.get('/',ensureGuest, async function (req, res, next) {
	res.render('login', {
		error: req.flash('loginMessage')
	});
});

//logout
router.get('/logout', function (req, res, next) {
	req.logOut()
	res.redirect('/')
});
//signin with google
router.get('/google', passport.authenticate('google', {
	scope: ['profile', 'email']
}));
router.get(
	'/google/callback',
	(req, res, next) => {
		passport.authenticate('google', function (err, user, info) {
			if (err) {
				return next(err);
            }

			if (!user) {
				req.flash('loginMessage', `Loi dang nhap`)
				return res.redirect('/auth');
			}
			req.logIn(user, function (err) {
                
                if (err) {
					return next(err);
                }
                const token = generateAccessToken({ userId: user.id })
				return res.redirect('/');
			});
		})(req, res, next);
	}
)



module.exports = router;
