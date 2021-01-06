const {
	describe,
	it,
	assert,
	requester,
} = require("./startup.test");


describe("Test realtime_controller", () => {

	it("get getBackEndTime", async () => {
		const res = await requester.get("/api/1.0/realtime/getIndex");
		const testKeyArr = [
			"bigIndex",
			"futureIndex",
			"optDis"
		];
		assert.equal(res.status, 200);
		assert.isObject(res.body);
		assert.containsAllKeys(res.body, testKeyArr);
	});
	
});