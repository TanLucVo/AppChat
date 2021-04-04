const io = require("socket.io")();
const socketIO = {
    io: io
};

// Add your socket.io logic here!
io.on("connection", function (client) {

    console.log("Client "+client.id+" da ket noi")
    let users = Array.from([])
    
    client.on('disconnect', () => console.log("Client " + client.id + " da thoat"))

    // server lắng nghe dữ liệu từ client

    client.on("register-id", (userId) =>{
        client.userId = userId
        client.broadcast.emit("register-id",{id : client.id, userId: client.id})
    })

    client.emit('list-users', users)

});
// end of socket.io logic

module.exports = socketIO;