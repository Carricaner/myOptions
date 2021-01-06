require("dotenv").config();
const { 
	// execution mode
	NODE_ENV,
	// aws RDS mysql information
	aws_rds_mysql_HOST,
	aws_rds_mysql_USER,
	aws_rds_mysql_PASSWORD,
	aws_rds_mysql_DATABASE,
	aws_rds_mysql_DATABASE_TEST,

} = process.env;

const multipleStatements = (NODE_ENV === "test");
const mysql = require("mysql");
const { promisify } = require("util");

function mysqlConfig(NODE_ENV) {

	const condition = {
		connectionLimit : 10,
		host     : null,
		user     : null,
		password : null,
		database : null,
		supportBigNumbers: true, 
		bigNumberStrings: true
	};

	if (NODE_ENV == "test") {
		condition.host = aws_rds_mysql_HOST;
		condition.user = aws_rds_mysql_USER;
		condition.password = aws_rds_mysql_PASSWORD;
		condition.database = aws_rds_mysql_DATABASE_TEST;
	} else {
		condition.host = aws_rds_mysql_HOST;
		condition.user = aws_rds_mysql_USER;
		condition.password = aws_rds_mysql_PASSWORD;
		condition.database = aws_rds_mysql_DATABASE;
	}

	return condition;
}

const mysqlPool = mysql.createPool(mysqlConfig(NODE_ENV), {multipleStatements});
const mysqlCon = mysql.createConnection(mysqlConfig(NODE_ENV), {multipleStatements});

const transPromise = function(sql, container = null, carrier = null) { 

	// sql        ==> mySQL query sentence
	// container  ==> the portion needs to be inserted in SQL
	// carrier    ==> the things that needs to be tansfered throught async process
    
	const databaseQuery = (condition, carrier) => {
		return new Promise((resolve, reject) => {
			mysqlPool.query(condition, (err, result) => {
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


const promiseQuery = promisify(mysqlCon.query).bind(mysqlCon);
const promiseTransaction = promisify(mysqlCon.beginTransaction).bind(mysqlCon);
const promiseCommit = promisify(mysqlCon.commit).bind(mysqlCon);
const promiseRollback = promisify(mysqlCon.rollback).bind(mysqlCon);
const promiseEnd = promisify(mysqlCon.end).bind(mysqlCon);


module.exports = {
	transPromise,
	query: promiseQuery,
	transaction: promiseTransaction,
	commit: promiseCommit,
	rollback: promiseRollback,
	end: promiseEnd,
};


