const redis = require("redis")
const client = redis.createClient()


const redisTurnOn = () => {
    client.on("connect", () => {
		console.log("<< Redis: client connected >>");
	});
}

const redisClient = client

const redisGet = (key) => {
    return new Promise((resolve, reject) => {

        client.get(key, (err, value) => {
            if (err) {
                reject(`Redis-set ${key} failed.`)
            } else {
                resolve(value)
            }

        })

    })

}

















module.exports = {
    redisTurnOn,
    redisClient,
    redisGet
}