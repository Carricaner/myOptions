const io = require('socket.io')
const { redisClient } = require("./util_redis")
const { getNowTime } = require("./util_timezone")
var moment = require('moment-timezone');


const deploySocket = (server) => {
    const serverIo = io(server)
    serverIo.on('connection', (socket) => {
        console.log('a user connected');

        // periodical emitter
        setInterval(() => {
            // refresh 加權指數 to client
            redisClient.get("bigIndexContainer", (err, value) => {
                socket.emit(
                    'bigIndexContainer',
                    JSON.parse(value)
                )
            })

            // refresh 台指期 to client
            redisClient.get("futureContainer", (err, value) => {
                socket.emit(
                    'futureContainer',
                    JSON.parse(value)
                )
            })

            // refresh 選擇權報價 to client
            redisClient.get("realtimeOpt", (err, value) => {
                socket.emit(
                    'realtimeOpt',
                    JSON.parse(value)
                )
            })

            // 統一時間
            socket.emit(
                'time',
                getNowTime()
            )

        }, 5*1000);


        // disconnection
        socket.on('disconnect', () => {
            console.log('a user disconnected');
        });

    });

}






module.exports = {
	deploySocket
}