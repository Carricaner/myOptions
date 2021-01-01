require("dotenv").config();
const mysql = require("mysql");

// =====================<< MySQL >>=====================
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

const pool = mysql.createPool(mysqlUserSwitcher("awsRDS"));

// =====================<< SQL Promise >>=====================
const transPromise = function(sql, container = null, carrier = null) { 

	// sql        ==> mySQL query sentence
	// container  ==> the portion needs to be inserted in SQL
	// carrier    ==> the things that needs to be tansfered throught async process
    
	// (Inner Function) Database query function
	const databaseQuery = (condition, carrier) => {
		return new Promise((resolve, reject) => {
			pool.query(condition, (err, result) => {
				if(err) {
					console.log(err.message);
					reject(err);
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



module.exports = {
	pool,
	transPromise,
};


