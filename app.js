require("dotenv").config();

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

// Turn on redis
redisTurnOn();
const { startRedisRefresher } = require("./server/controllers/redisUpdate_controller");

// Turn on redis refresher
startRedisRefresher(); 


// =====================<< API routes >>=====================
app.use("/api/1.0",
	[
		require("./server/routes/auth_route"),
		require("./server/routes/profile_route"),
		require("./server/routes/analysis_route"),
		require("./server/routes/user_route"),
		require("./server/routes/trade_route"),
		require("./server/routes/realtime_route"),
	]
);


// =====================<< Page not found >>=====================
app.use(function(req, res, next) {
	res.status(404).sendFile(__dirname + "/public/404.html");
});


// =====================<< Error handling >>=====================
app.use(function(err, req, res, next) {
	console.log(err);
	res.status(500).send("Internal Server Error");
});

server.listen(3000, () => {
	console.log("<< Server: listening to port 3000 >>");
});

module.exports = { app };