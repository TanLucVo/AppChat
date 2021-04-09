const roomModel = require("../models/room");

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
        let { roomId, message, createAt, image } = data
        let usersId =await roomModel.findOne({ _id: roomId })
        let sendByName = usersId.users.filter(e => e.id == client.userId);

        usersId = usersId.users.map(e => parseInt(e.id))
        sendByName = sendByName[0].name

        let allSocket = Array.from(io.sockets.sockets.values())
        for (let i of allSocket) {
            if (usersId.includes(i.userId)) {
                i.join(roomId);
            }
        }
        client.to(roomId).emit('new-message',{data, sendById: client.userId, name:sendByName});
    })
    client.emit('list-users', users)


});

// end of socket.io logic

module.exports = socketIO;