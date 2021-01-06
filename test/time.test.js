const {
	describe,
	it,
	assert,
	requester,
} = require("./startup.test");


describe("Test time_controller", () => {

	it("get getBackEndTime", async () => {
		const res = await requester.get("/api/1.0/time/getBackEndTime");
		const testKeyArr = [
			"nowInMilliSec",
			"nowYear",
			"nowMonth",
			"nowDay",
			"nowHour", 
			"nowMinute", 
			"nowSecond", 
			"dateOfWeek",
			"isDay",
			"isNight",
			"isafterDayCleanTime",
			"isafterNightCleanTime"
		];
		assert.equal(res.status, 200);
		assert.isObject(res.body);
		assert.containsAllKeys(res.body, testKeyArr);
	});
	
});

