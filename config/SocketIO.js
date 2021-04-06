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
        client.broadcast.emit('user-leave '+ client.id)
    })
    //gui thogn tin nguoi online moi 
    client.broadcast.emit("new-user", {id:client.id, userId:client.userId})
    // server lắng nghe dữ liệu từ client

    // client.on("register-id", (userId) =>{
    //     client.broadcast.emit("register-id", { id: client.id, userId: userId })
    // })
    client.emit('list-users', users)


});
// end of socket.io logic

module.exports = socketIO;