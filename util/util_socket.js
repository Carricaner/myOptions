const io = require('socket.io')
const { redisClient, redisGet } = require("./util_redis")
var moment = require('moment-timezone');


const deploySocket = (server) => {
    const serverIo = io(server)
    serverIo.on('connection', (socket) => {
        console.log('a user connected');

        // periodical emitter
        setInterval(() => {
            // refresh 大盤指數/台指期 to client
            redisClient.get("realtimeBigIndex", (err, value) => {
                socket.emit(
                    'rtBigIndex',
                    JSON.parse(value)
                )
            })

            // refresh 選擇權報價 to client
            redisClient.get("realtimeOpt", (err, value) => {
                socket.emit(
                    'rtOptDis',
                    JSON.parse(value)
                )
            })
            // test
            socket.emit(
                "test",
                {
                    x: ["2020-12-01 12:00:00", "2020-12-01 12:01:00", "2020-12-01 12:02:00", "2020-12-01 12:02:00"],
                    y: [14152, 12190, 13253, 13253]
                }

            )

        }, 3*1000);


        // disconnection
        socket.on('disconnect', () => {
            console.log('a user disconnected');
        });

    });

}






module.exports = {
	deploySocket
}