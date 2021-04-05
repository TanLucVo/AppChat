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

    message:{
        type: Array,
        required:true
    }

})

module.exports = mongoose.model('room', RoomSchema)