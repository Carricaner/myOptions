const io = require("socket.io");
const { redisClient } = require("./util_redis");
const { getNowTime } = require("./util_timezone");


const deploySocket = (server) => {
	const serverIo = io(server);
	serverIo.on("connection", (socket) => {

		// periodical emitter
		setInterval(() => {

			// refresh 加權指數 to client
			redisClient.get("bigIndexContainer", (err, value) => {
				socket.emit(
					"bigIndexContainer",
					JSON.parse(value)
				);
			});

			// refresh 台指期 to client
			redisClient.get("futureContainer", (err, value) => {
				socket.emit(
					"futureContainer",
					JSON.parse(value)
				);
			});

			// refresh 選擇權報價 to client
			redisClient.get("realtimeOpt", (err, value) => {
				socket.emit(
					"realtimeOpt",
					JSON.parse(value)
				);
			});

			// united time
			socket.emit(
				"time",
				getNowTime()
			);

		}, 5*1000);

	});

};



module.exports = {
	deploySocket
};