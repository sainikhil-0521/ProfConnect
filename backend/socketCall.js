const { Server } = require('socket.io');
let IO;
let arr=[];

module.exports.initIO = (httpServer) => {
    IO = new Server(httpServer);

    IO.use((socket, next) => {
        if (socket.handshake.query) {
            let userName = socket.handshake.query.name
            socket.user = userName;
            next();
        }
    })

    IO.on('connection', (socket) => {
        let _id=socket.id
        console.log(socket.user, "Connected");

        socket.join(socket.user);

        socket.on('call', (data) => {
            let callee = data.name;
            let rtcMessage = data.rtcMessage;
            if(arr.includes(callee)){
                console.log("999",socket.user,callee);
                socket.nsp.to(socket.user).emit("callRejected", {
                    callee: callee,
                    rtcMessage: rtcMessage
                })
            }
            else{
            socket.to(callee).emit("newCall", {
                caller: socket.user,
                rtcMessage: rtcMessage
            })
        }

        })

        socket.on('answerCall', (data) => {
            let caller = data.caller;
            rtcMessage = data.rtcMessage
            arr.push(caller);
            arr.push(socket.user);
            socket.to(caller).emit("callAnswered", {
                callee: socket.user,
                rtcMessage: rtcMessage
            })

        })
        socket.on('rejectCall', (data) => {
            let caller = data.caller;
            rtcMessage = data.rtcMessage

            socket.to(caller).emit("callRejected", {
                callee: socket.user,
                rtcMessage: rtcMessage
            })

        })

        socket.on('ICEcandidate', (data) => {
            let otherUser = data.user;
            let rtcMessage = data.rtcMessage;

            socket.to(otherUser).emit("ICEcandidate", {
                sender: socket.user,
                rtcMessage: rtcMessage
            })
        })
        socket.on('disconnecting',(data,okok)=>{
            console.log(data.id,okok,_id," disconnected");
        })
    })
}

module.exports.getIO = () => {
    if (!IO) {
        throw Error("IO not initilized.")
    } else {
        return IO;
    }
}