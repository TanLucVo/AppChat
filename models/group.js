const mongoose = require('mongoose')

const groupSchema = mongoose.Schema({

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
    image: {
        type: String,
		required: false,
    }


})

module.exports = mongoose.model('group-chat', groupSchema)