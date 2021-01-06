const {
	NODE_ENV,
	after,
	requester,
} = require("./startup.test");


after(async() => {
	if (NODE_ENV !== "test") {
		throw new Error("NODE_ENV is not changed!");
	} else {
		console.log("The whole test is done!");
		requester.close();
	}
});