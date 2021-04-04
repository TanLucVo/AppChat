const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	image: {
		type: String,
	}
})

module.exports = mongoose.model('Users', UserSchema)