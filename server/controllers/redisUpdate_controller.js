var moment = require("moment-timezone");
const { redisClient, redisGet } = require("../../util/util_redis");
const { getNowTime } = require("../../util/util_timezone");

function startRedisRefresher() {

	const realtimeUpdateSec = 7 * 1000;
	const flushCacheSec = 10 * 1000;
	const timeDisplaySec = 7 * 1000;

	setInterval(() => {
		let TWtimeParams = getNowTime();
		if (TWtimeParams.isDay || TWtimeParams.isNight) {
			addRealtimeData2Container();
		}
	},
	realtimeUpdateSec);

	setInterval(() => {
		let TWtimeParams = getNowTime();
		if (TWtimeParams.isafterDayCleanTime || TWtimeParams.isafterNightCleanTime) {
			flushRedisContainer("bigIndexContainer");
			flushRedisContainer("futureContainer");
		}
	},
	flushCacheSec);

	setInterval(() => {
		let TWtimeParams = getNowTime();
		console.log(TWtimeParams);
	},
	timeDisplaySec);
    
}

function addRealtimeData2Container() {
	Promise.all([
		redisGet("realtimeBigIndex"),
		redisGet("bigIndexContainer"),
		redisGet("futureContainer")
	])
		.then(results => {
			let newBigIndexContainer = redisContainerUpdate(results[0], results[1], true);
			let newFutureContainer = redisContainerUpdate(results[0], results[2], false);
			return [newBigIndexContainer, newFutureContainer];
		})
		.then(results => {
			redisClient.set("bigIndexContainer", JSON.stringify(results[0]));
			redisClient.set("futureContainer", JSON.stringify(results[1]));
			console.log("containers updated!");
		})
		.catch(err => {
			console.log(err);
		});
}


function redisContainerUpdate(cacheRealtime, cacheContainer, isBigIndex) {
	let newContainer = JSON.parse(cacheContainer);
	let { date, time, data } = JSON.parse(cacheRealtime);
	let timeString = date + " " + time;
	let timestamp = moment.tz(timeString, "Asia/Taipei");

	let switcher = 0;
	if (isBigIndex) {

		// 大盤指數
		switcher = 0;
	} else {

		// 台指期
		switcher = 1;
	}
	if (!data[switcher].dealprice) {
		let emptyContainer = {
			name : "isClosed",
			data: [],
			open: null,
			high: null,
			low: null,
			dealprice: null,
			isOpen: false,
			time: null
		};
		return emptyContainer;

	} else {
		let prodName = data[switcher].name;
		let timestampInMillisec = timestamp.valueOf() + 28800000;
		let realtimeBigIndex = Number(data[switcher].dealprice);

		newContainer.name = prodName;
		newContainer.isOpen = true;
		newContainer.time = timeString;
		newContainer.open = Number(data[switcher].open);
		newContainer.high = Number(data[switcher].high);
		newContainer.low  = Number(data[switcher].low);
		newContainer.dealprice  = Number(realtimeBigIndex);
		newContainer.data.push([timestampInMillisec, realtimeBigIndex]);

		return newContainer;
	}
    
}


function flushRedisContainer(key) {
	redisClient.del(key, (err, reply) => {

		if (err) {
			console.log(`Error while cleaning up redis key: ${key}`);
		} else {
			let emptyContainer = {
				name : "isClosed",
				data: [],
				open: null,
				high: null,
				low: null,
				dealprice: null,
				isOpen: false,
				time: null
			};
			redisClient.set(key, JSON.stringify(emptyContainer));
			console.log(`Redis key: ${key} flushed!`);
		}
	});
}



module.exports = {
	startRedisRefresher,
	flushRedisContainer,
};