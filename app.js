require("dotenv").config();
const {
	PORT_TEST, 
	PORT, 
	NODE_ENV, 
	API_VERSION
} = process.env;
const port = NODE_ENV == "test" ? PORT_TEST : PORT;


// =====================<< Express Initialization >>=====================
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());


// =====================<< Use static files >>=====================
app.use(express.static("public"));


// =====================<< Socket.io >>=====================
const server = require("http").createServer(app);
const { deploySocket } = require("./util/util_socket.js");
deploySocket(server);


// =====================<< CORS allow all >>=====================
app.use(cors());


// =====================<< Redis >>=====================
const { redisTurnOn } = require("./util/util_redis");
const { startRedisRefresher } = require("./server/controllers/redisUpdate_controller");

redisTurnOn();  // Turn on redis
startRedisRefresher();  // Turn on redis refresher


// =====================<< API routes >>=====================
app.use("/api/" + API_VERSION,
	[
		require("./server/routes/auth_route"),
		require("./server/routes/time_route"),
		require("./server/routes/profile_route"),
		require("./server/routes/analysis_route"),
		require("./server/routes/user_route"),
		require("./server/routes/trade_route"),
		require("./server/routes/realtime_route"),
	]
);


// =====================<< Error handling >>=====================
app.use(function(req, res, next) {
	res.status(404).sendFile(__dirname + "/public/404.html");
});


app.use(function(err, req, res, next) {
	console.log(err);
	res.status(500).send("Internal Server Error");
});


if (NODE_ENV != "production") {
	server.listen(port, () => {
		console.log(`<< Server: listening to port ${port} >>`);
	});
}


module.exports = { 
	app, 
	server,
};