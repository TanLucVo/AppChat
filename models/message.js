const mongoose = require('mongoose')

const MessageSchema = mongoose.Schema({

    roomId: {
        type: String,
		required: false,
    },
	userId: {
		type: String,
		required: true,
    },

    message:{
        type: String,
        required:true
    },

    createAt:{
        type: Number,
        required:true
    }

})

module.exports = mongoose.model('message', MessageSchema)