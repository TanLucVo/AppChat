var express = require('express');
const user = require('../models/user');
var router = express.Router();

/* GET home page. */
router.get('/',  function (req, res, next) {

});

router.post('/getUser', async function (req, res, next) {
    let {query} = req.body;
    console.log(query)
    try {
        let data = await user.find({userId :{ $ne: req.user.userId }})
        data = data.map(e => ({id:e.userId,name: e.name, image :e.image }))
        res.status(200).json({data:data})
    } catch (error) {
        res.status(500).send("Can't get data")
    }
});

module.exports = router;
