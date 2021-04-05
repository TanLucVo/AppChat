var express = require('express');
const room = require('../models/room');
const user = require('../models/user');
var router = express.Router();

/* GET home page. */
router.get('/',  function (req, res, next) {

});

router.post('/getUser', async function (req, res, next) {
    let {query} = req.body;
    console.log(query)
    try {
        let data = await user.find({userId :{ $ne: req.user.userId } ,$text: { $search: query }})
        data = data.map(e => ({ id: e.userId, name: e.name, image: e.image }))
        res.status(200).json({ data: data })
        
    } catch (error) {
        console.log(error)
        res.status(500).send("Can't get data")
    }
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
    let { id } = req.body;
    console.log(req.body)
    if (!id) {
        return res.send("Missing id")
    }
    try {
        let data = await room.find({"users.id": id})
        res.status(200).json({ data: data })
        
    } catch (error) {
        console.log(error)
        res.status(500).send("Can't get data")
    }
});

router.post('/getRoomById', async function (req, res, next) {
    let {id2} = req.body;
    
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

                message:[]
            }
            dataroom = await room.create(newRoom)
            return res.status(200).json({ data: dataroom })
        }
        res.status(200).json({ data: data })
        
    } catch (error) {
        console.log(error)
        res.status(500).send("Can't get data")
    }
});


module.exports = router;
