const mongoose = require('mongoose')

const RoomSchema = mongoose.Schema({
	users: {
		type: Array,
		required: true,
    },
    name:{
        type: Array,
        required:true
    },
    message:{
        type: Array,
        required:true
    }

    
	
})

module.exports = mongoose.model('room', RoomSchema)