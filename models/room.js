const mongoose = require('mongoose')

const RoomSchema = mongoose.Schema({

	roomName: {
		type: String,
		required: false,
	},
	users: {
		type: Array,
		required: true,
	},
	updateAt: {
		type: Number,
		required: true,
	},
	lastMessage: {
		type: Array,
		required: false,
	},


})

module.exports = mongoose.model('single-chat', RoomSchema)