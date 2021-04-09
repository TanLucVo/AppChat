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


})

module.exports = mongoose.model('room', RoomSchema)