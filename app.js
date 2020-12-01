require('dotenv').config();


// Express Initialization
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const app = express();

//=====================Darren's Socket.io=====================
const server = require("http").createServer(app);
const io = require('socket.io');
module.exports = { server, io };
//============================================================


const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

//=====================<< Use static files >>=====================
app.use(express.static('public'));



//=====================<< CORS allow all >>=====================
app.use(cors());



//=====================<< Redis >>=====================
const redis = require("redis");
const client = redis.createClient();

let redisGears = {};
redisGears.turnOn = () => {
	client.on("connect", () => {
		console.log("<<<--- Redis: client connected --->>>");
	});
};
// redisGears.setAsync = promisify(client.set).bind(client);
// redisGears.getAsync = promisify(client.get).bind(client);
redisGears.client = client;

redisGears.turnOn();

redisGears.client.get("realtimeBigIndex", (err, value) => {
	console.log(JSON.parse(value))
})




//=====================<< MySQL >>=====================
const mysql = require("mysql");

const { 
    // aws RDS mysql information
	aws_rds_mysql_HOST,
	aws_rds_mysql_USER,
	aws_rds_mysql_PASSWORD,
	aws_rds_mysql_DATABASE,
} = process.env;

function mysqlUserSwitcher(des) {

	const poolContent = {
		connectionLimit : 10,
		host     : null,
		user     : null,
		password : null,
		database : aws_rds_mysql_DATABASE,
		supportBigNumbers: true, 
		bigNumberStrings: true
	};

	if (des == "localRoot") {
		poolContent.host = root_HOST;
		poolContent.user = root_USER;
		poolContent.password = root_PASSWORD;
	} else if (des == "localGuest") {
		poolContent.host = guest_HOST;
		poolContent.user = guest_USER;
		poolContent.password = guest_PASSWORD;
	} else if (des == "awsRDS") {
		poolContent.host = aws_rds_mysql_HOST;
		poolContent.user = aws_rds_mysql_USER;
		poolContent.password = aws_rds_mysql_PASSWORD;
	} else {
		poolContent.host = guest_HOST;
		poolContent.user = guest_USER;
		poolContent.password = guest_PASSWORD;
	}

	return poolContent;
}

// console.log(mysqlUserSwitcher("awsRDS"))
const pool = mysql.createPool(mysqlUserSwitcher("awsRDS"));



//=====================<< SQL Promise >>=====================
const transPromise = function(sql, container = null, carrier = null) { 

	// sql        ==> mySQL query sentence
	// container  ==> the portion needs to be in sql
	// carrier    ==> the things that needs to be tansfered throught async process
    
	// (Inner Function) Database query function
	const databaseQuery = (condition, carrier) => {
		return new Promise((resolve, reject) => {
			pool.query(condition, (err, result) => {
				if(err) {
					console.log("<< Error in Promise! >>");
					reject("< Error in Promise!>");
				} else {
					let shuttle = {
						result: result,
						carrier: carrier
					};
					if (result.insertId) {
						shuttle.insertId = result.insertId;
					}
					resolve(shuttle);
				}
			});
		});
	};

	let condition = {sql: sql};
	if (container) {
		condition.values = container;
	}
	return databaseQuery(condition, carrier);    
};














//=====================<< API routes >>=====================
// app.use('/api/' + API_VERSION,
//     [
//         require('./server/routes/admin_route'),
//         require('./server/routes/product_route'),
//         require('./server/routes/marketing_route'),
//         require('./server/routes/user_route'),
//         require('./server/routes/order_route'),
//     ]
// );



//=====================<< test update plot>>=====================


app.get("/getPromptOptData", (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;

        connection.beginTransaction((err) => {
            if (err) throw err;

            connection.query('SELECT * FROM realtime_opt LOCK IN SHARE MODE', (err, result) => {
                if (err) {return connection.rollback(() => {throw err})}

                connection.commit((err) => {
                    if (err) {return connection.rollback(() => {throw err})}
                    
                    console.log("Success!")
                    res.send(result)
                })

            })

        })

    })
})




// var servIo = io.listen(server);
// servIo.on('connection', function (socket) {
//     console.log("Somebody is here! Welcome!")
//     setInterval( function () {
//         socket.emit('people', { 
//             'second': new Date().getSeconds(), 
//             'people': 15,
//             'time': 2
//         });
//     }, 1000);

//     // socket.emit('people', { 'second': new Date().getSeconds(), 'people': peopleNumber });

//     socket.on('chat message', (msg) => {
//         console.log('message: ' + msg);
//       });

//     socket.on('disconnect', () => {
//         console.log('user disconnected');
// 	});
	
// });

// var servIo = io.listen(server);
// servIo.on('connection', function (socket) {
// 	setInterval( function () {
// 		        socket.emit('data', { 
// 		            'second': new Date().getSeconds(), 
// 		            'people': 15,
// 		            'time': 2
// 		        });./

// })

app.get("/testAPI", (req, res) => {


	// Wait to use Redis

	// pool.query('SELECT * FROM realtime_bigindex LOCK IN SHARE MODE', (err, result) => {
	// 	console.log("Success!")
	// 				let data = {
	// 					bigIndex: {
	// 						name: result[0].name,
	// 						dealprice: Number(result[0].dealprice)
	// 					},
	// 					futureIndex: {
	// 						name: result[1].name,
	// 						dealprice: Number(result[1].dealprice)
	// 					},
	// 				}

	// 				res.send(data)
		
	// })
})




app.get("/getPromptBigIndexData", (req, res) => {

	pool.getConnection((err, connection) => {
		if (err) throw err;

		connection.beginTransaction((err) => {
			if (err) throw err;

			connection.query('SELECT * FROM realtime_bigindex LOCK IN SHARE MODE', (err, result) => {
				if (err) {return connection.rollback(() => {throw err})}

				connection.commit((err) => {
					if (err) {return connection.rollback(() => {throw err})}
					
					console.log("Success!")
					let data = {
						bigIndex: {
							name: result[0].name,
							dealprice: Number(result[0].dealprice)
						},
						futureIndex: {
							name: result[1].name,
							dealprice: Number(result[1].dealprice)
						},
					}

					res.send(data)
					
				})

			})

		})

	})
	
})







//===============================================================






//=====================<< Page not found >>=====================
app.use(function(req, res, next) {
    res.status(404).sendFile(__dirname + '/public/404.html');
});


//=====================<< Error handling >>=====================
app.use(function(err, req, res, next) {
    console.log(err);
    res.status(500).send('Internal Server Error');
});

server.listen(3000, () => {
    console.log('<< Listening port: 3000 >>')
})

module.exports = { app };