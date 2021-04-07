var express = require('express');
const room = require('../models/room');
const user = require('../models/user');
var router = express.Router();
const messageModel = require('../models/message');
const socketIO = require('../config/SocketIO');
const io = socketIO.io;
/* GET home page. */
router.get('/',  function (req, res, next) {

});


router.post('/getUser', async function (req, res, next) {
    let {query} = req.body;
    try {
        let data = await user.find({userId :{ $ne: req.user.userId } ,$text: { $search: query }})
        data = data.map(e => ({ id: e.userId, name: e.name, image: e.image }))
        res.status(200).json({ data: data })
        
    } catch (error) {
        console.log(error)
        res.status(500).send("Can't get data")
    }
});

router.post('/getRoom', async function (req, res, next) {
    let id = req.user.userId
    const filter=async (item)=>{
        let partner = item.users.filter(e => e.id != id) 
        let partnerInfo = await user.findOne({userId: partner[0].id})
        let image =partnerInfo.image
        return {roomId: item._id, userId: partner[0].id, name: partner[0].name, image: image}
    }
    const getAllfilter=(data)=>{
        const promises = data.map(async item=> await filter(item))
        return Promise.all(promises);
    }
    if (!id) {
        return res.send("Missing id")
    }
    try {

        let data = await room.find({"users.id": id})
        let filterData =await getAllfilter(data)
        res.status(200).json({ data: filterData  })
        
    } catch (error) {
        console.log(error)
        res.status(500).send("Can't get data")
    }
});

router.post('/getRoomById', async function (req, res, next) {
    let {id2, time} = req.body;
    let user1 = req.user
    if (!id2) {
        return res.status(500).json({ error:"user khong duoc de trong" })
    }else if (id2 === req.user.userId) {
        return res.status(500).json({ error:"user khong duoc trung" })
    } else if(id2.trim()==="") {
        return res.status(500).json({ error:"user khong duoc de trong" })
    }
    let dataroom;
    try {
        
        let user2 = await user.findOne({ userId: id2 })
        if (user2 == null) {
            return res.status(500).json({ error:"user khong ton tai" })
        }
        let data = await room.findOne({
            $or: [
                { $and: [{ "users.0.id": user1.userId }, { "users.1.id": user2.userId }] },
                { $and: [{ "users.0.id": user2.userId }, { "users.1.id": user1.userId }] }
            ]
            
        })

        if (!data) {
            let newRoom = {
                users: [

                    {
                        "id": user1.userId,
                        "name":user1.name
                    },
                    {
                        "id": user2.userId,
                        "name":user2.name
                    }
                ],
            }
            dataroom = await room.create(newRoom)
            return res.status(200).json({ data: dataroom, image:user2.image })
        }
        let message
        if (time != null && time) {
            message = await messageModel.find({ roomId: data._id, createAt: { $lt: time }}).sort({ "createAt": -1 }).limit(20)
        } else {
            message = await messageModel.find({ roomId: data._id }).sort({ "createAt": -1 }).limit(20)
        }
        
        message = message.map(e => {
            const isMe = e.userId===req.user.userId
            return {message:e.message, createAt: e.createAt, image: e.image,name:e.name, isMe:isMe}
        })

        res.status(200).json({ data: data, message:message })
        
    } catch (error) {
        console.log(error)
        res.status(500).send("Can't get data")
    }
});
router.post('/newMessage', async function (req, res, next) {
    let {roomId, message} = req.body
    if(!roomId || !message ){
        return res.status(300).send("Invalid data")
    }
    message = message.trim()
    if (message === "") {
        return res.status(300).send("Empty message")
    }
    let createAt = Date.now()
    let newMessage = {
        userId: req.user.userId,
        roomId: roomId,
        message:message,
        createAt: createAt,
        image: req.user.image,
        name: req.user.name
    }
    messageModel.create(newMessage, function(err, result) {
        if (err) {
            return res.status(300).send("Khong the them")
        }
        else {
            return res.status(200).json( { roomId: roomId, message: message, createAt:createAt, image: req.user.image})
        }

    });
});

router.post('/lastMessage', async function (req, res, next) {
    let {roomId} = req.body
    roomId = roomId.trim()
    if(!roomId){
        return res.status(300).send("Invalid data")
    }
    if(roomId==="") return res.status(300).send("Invalid data")

    try {
        let data = await messageModel.find({roomId:roomId}).sort({createAt:-1}).limit(1)
        return res.status(200).json({data:data})
    } catch (error) {
        
    }
});


module.exports = router;
