var express = require('express');
const room = require('../models/room');
const groupChat = require('../models/group');
const user = require('../models/user');
var router = express.Router();
const messageModel = require('../models/message');
const socketIO = require('../config/SocketIO');
const group = require('../models/group');
const io = socketIO.io;
/* GET home page. */
router.get('/', function (req, res, next) {

});


router.post('/getUser', async function (req, res, next) {
    let {
        query
    } = req.body;
    try {
        let data = await user.find({
            userId: {
                $ne: req.user.userId
            },
            $text: {
                $search: query
            }
        })
        data = data.map(e => ({
            id: e.userId,
            name: e.name,
            image: e.image
        }))
        res.status(200).json({
            data: data
        })

    } catch (error) {
        console.log(error)
        res.status(500).send("Can't get data")
    }
});

router.post('/getRoomSigle', async function (req, res, next) {
    let id = req.user.userId
    let { number } = req.body||0
    
    if (!id) {
        return res.send("Missing id")
    }
    try {

        let data = await room.find({
            "users.id": id
        }).sort({
            updateAt: -1
        }).skip(number).limit(11)

        res.status(200).json({
            data: data
        })


    } catch (error) {
        console.log(error)
        res.status(500).send("Can't get data")
    }
});
router.post('/getRoomGroup', async function (req, res, next) {
    let {number} = req.body
    let id = req.user.userId

    if (!id) {
        return res.send("Missing id")
    }
    try {

        let data = await groupChat.find({
            "users.id": id
        }).sort({
            updateAt: -1
        }).skip(number).limit(11)
        res.status(200).json({
            data: data
        })

    } catch (error) {
        console.log(error)
        res.status(500).send("Can't get data")
    }
});

router.post('/getRoomById', async function (req, res, next) {
    let {
        id2,
        time
    } = req.body;
    let user1 = req.user
    if (!id2) {
        return res.status(500).json({
            error: "user khong duoc de trong"
        })
    } else if (id2 === req.user.userId) {
        return res.status(500).json({
            error: "user khong duoc trung"
        })
    } else if (id2.trim() === "") {
        return res.status(500).json({
            error: "user khong duoc de trong"
        })
    }
    let dataroom;
    try {

        let user2 = await user.findOne({
            userId: id2
        })
        if (user2 == null) {
            return res.status(500).json({
                error: "user khong ton tai"
            })
        }
        let data = await room.findOne({
            $and: [{
                    $or: [{
                            $and: [{
                                "users.0.id": user1.userId
                            }, {
                                "users.1.id": user2.userId
                            }]
                        },
                        {
                            $and: [{
                                "users.0.id": user2.userId
                            }, {
                                "users.1.id": user1.userId
                            }]
                        }
                    ]
                },
                {
                    "roomName": {
                        $exists: false
                    }
                }
            ]


        })

        if (!data) {
            let newRoom = {
                users: [

                    {
                        "id": user1.userId,
                        "name": user1.name,
                        "image": user1.image
                    },
                    {
                        "id": user2.userId,
                        "name": user2.name,
                        "image": user2.image
                    }
                ],
                updateAt: Date.now(),
            }
            dataroom = await room.create(newRoom)
            return res.status(200).json({
                data: dataroom,
                image: user2.image
            })
        }
        let message
        if (time != null && time) {
            message = await messageModel.find({
                roomId: data._id,
                createAt: {
                    $lt: time
                }
            }).sort({
                "createAt": -1
            }).limit(40)
        } else {
            message = await messageModel.find({
                roomId: data._id
            }).sort({
                "createAt": -1
            }).limit(40)
        }

        message = message.map(e => {
            const isMe = e.userId === req.user.userId
            return {
                message: e.message,
                createAt: e.createAt,
                image: e.image,
                name: e.name,
                isMe: isMe
            }
        })

        res.status(200).json({
            data: data,
            message: message
        })

    } catch (error) {
        console.log(error)
        res.status(500).send("Can't get data")
    }
});
router.post('/newMessage', async function (req, res, next) {
    let {
        roomId,
        message
    } = req.body
    if (!roomId || !message) {
        return res.status(300).send("Invalid data")
    }
    message = message.trim()
    if (message === "") {
        return res.status(300).send("Empty message")
    }
    let groupData = await group.findOne({
        _id: roomId
    })
    let isGroup = groupData != null ? true : false


    let createAt = Date.now()
    let newMessage = {
        userId: req.user.userId,
        roomId: roomId,
        message: message,
        createAt: createAt,
        image: req.user.image,
        name: req.user.name
    }
    messageModel.create(newMessage, async function (err, result) {
        if (err) {
            return res.status(300).send("Khong the them")
        } else {
            if (isGroup) {
                let test = await group.updateOne({
                    _id: roomId
                }, {
                    $set: {
                        updateAt: Date.now(),
                        lastMessage: [newMessage.message, newMessage.name, newMessage.userId]

                    }
                }, {
                    returnNewDocument: true
                })
                console.log(test)
            } else {
                await room.updateOne({
                    _id: roomId
                }, {
                    $set: {
                        updateAt: Date.now(),
                        lastMessage: [newMessage.message, newMessage.name, newMessage.userId]
                    }
                }, {
                    returnNewDocument: true
                })
            }


            return res.status(200).json({
                roomId: roomId,
                message: message,
                createAt: createAt,
                image: req.user.image
            })
        }

    });
});

router.post('/lastMessage', async function (req, res, next) {
    let {
        roomId
    } = req.body
    roomId = roomId.trim()
    if (!roomId) {
        return res.status(300).send("Invalid data")
    }
    if (roomId === "") return res.status(300).send("Invalid data")

    try {
        let data = await messageModel.find({
            roomId: roomId
        }).sort({
            createAt: -1
        }).limit(1)
        return res.status(200).json({
            data: data
        })
    } catch (error) {

    }
});

router.post('/addGroup', async function (req, res, next) {
    let {
        groupName,
        groupUserId
    } = req.body
    let groupUser = []
    if (!groupName || !groupUserId) {
        return res.status(300).json({
            data: "Invalid data"
        })
    }
    groupUserId.push(req.user.userId)


    if (groupUserId.length < 2) return res.status(300).json({
        data: "User must be greater than 2"
    })

    for (let i of groupUserId) {
        let user_info = await user.findOne({
            userId: i
        })
        groupUser.push({
            id: user_info.userId,
            name: user_info.name,
            image: user_info.image
        })
    }

    try {
        let newRoom = {
            users: groupUser,
            roomName: groupName,
            updateAt: Date.now(),
        }
        dataroom = await groupChat.create(newRoom)
        return res.status(200).json({
            data: dataroom
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send("Some error")
    }
});

router.post('/getRoomByRoomId', async function (req, res, next) {
    let {
        id,
        time
    } = req.body
    if (!id) {
        return res.status(300).send("Invalid data")
    }
    try {
        let message = await messageModel.find({
            roomId: id
        })

        if (time != null && time) {
            message = await messageModel.find({
                roomId: id,
                createAt: {
                    $lt: time
                }
            }).sort({
                "createAt": -1
            }).limit(40)
        } else {
            message = await messageModel.find({
                roomId: id
            }).sort({
                "createAt": -1
            }).limit(40)
        }
        message = message.map(e => {
            let isMe = e.userId == req.user.userId
            return {
                message: e.message,
                createAt: e.createAt,
                image: e.image,
                isMe: isMe,
                userId: e.userId,
                name: e.name
            }
        })
        return res.status(200).json({
            data: message
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send("Some error")
    }
});

router.post('/getGroupChat', async function (req, res, next) {
    let {
        id,
        time
    } = req.body
    if (!id) {
        return res.status(300).send("Invalid data")
    }
    try {
        let message = await messageModel.find({
            roomId: id
        })

        if (time != null && time) {
            message = await messageModel.find({
                roomId: id,
                createAt: {
                    $lt: time
                }
            }).sort({
                "createAt": -1
            }).limit(40)
        } else {
            message = await messageModel.find({
                roomId: id
            }).sort({
                "createAt": -1
            }).limit(40)
        }
        message = message.map(e => {
            let isMe = e.userId == req.user.userId
            return {
                message: e.message,
                createAt: e.createAt,
                image: e.image,
                isMe: isMe,
                userId: e.userId,
                name: e.name
            }
        })
        return res.status(200).json({
            data: message
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send("Some error")
    }
});


module.exports = router;