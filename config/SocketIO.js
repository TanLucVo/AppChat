const roomModel = require("../models/room");
const groupModel = require("../models/group");

const io = require("socket.io")();
const socketIO = {
    io: io
};

// Add your socket.io logic here!
io.on("connection", function (client) {

    console.log("Client "+client.id+" da ket noi")
    let users = Array.from(io.sockets.sockets.values()).map(socket=>({id:socket.id, userId:socket.userId}))
    client.on('disconnect', () => {
        console.log(client.id + "da roi khoi cuoc choi");
        client.broadcast.emit("user-leave", client.id)
    })
    //gui thogn tin nguoi online moi 
    client.broadcast.emit("new-user", {id:client.id, userId:client.userId})
    // server lắng nghe dữ liệu từ client

    client.on("register-id", (userId) => {
        client.userId = userId;
        client.broadcast.emit("register-id",{id:client.id, userId:userId})
    })
    client.on("send-room", async (data) => {
        let { roomId, message, image, type } = data
        let usersId;
        if (!type) {
            return
        }
       
        if (type && type === "group") {
            usersId = await groupModel.findOne({ _id: roomId })
        } else {
            usersId = await roomModel.findOne({ _id: roomId })
        }
        if (usersId == null) {
            return
        }

        let sendByName = usersId.users.filter(e => e.id == client.userId);

        usersId = usersId.users.map(e => parseInt(e.id))
        sendByName = sendByName[0].name
        if (io.sockets.adapter.rooms.get(roomId)) {
            client.to(roomId).emit('new-message', { data, sendById: client.userId, name: sendByName });
            return 
        }

        let allSocket = Array.from(io.sockets.sockets.values())
        for (let i of allSocket) {
            if (usersId.includes(i.userId)) {
                i.join(roomId);
            }
        }

        client.to(roomId).emit('new-message',{data, sendById: client.userId, name:sendByName});
    })
    client.on("new-group-chat", (data) => {
        let { roomName, updateAt, users, _v, _id } = data.data
        let usersId = users.map(e => e.id).filter(e => e.id != client.userId)
        let allSocket = Array.from(io.sockets.sockets.values())
        for (let i of allSocket) {
            if (usersId.includes(i.userId)) {
                i.join(_id);
            }
        }
        client.to(_id).emit('new-group-chat',data);
        
    })

    client.emit('list-users', users)


});

// end of socket.io logic

module.exports = socketIO;