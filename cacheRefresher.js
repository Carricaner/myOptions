const { flushRedisContainer } = require("./server/controllers/redisUpdate_controller");

flushRedisContainer("bigIndexContainer");
flushRedisContainer("futureContainer");

