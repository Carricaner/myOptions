require("dotenv").config();
const { server } = require("../app");
const { NODE_ENV } = process.env;

const { describe, it, before, after } = require("mocha");

const chai = require("chai");
const chaiHttp = require("chai-http");
const { assert, expect } = chai;
chai.use(chaiHttp);

const requester = chai.request(server).keepOpen();


before(async() => {
	if (NODE_ENV !== "test") {
		throw new Error("NODE_ENV is not yet changed!");
	}
});



module.exports = {
	NODE_ENV,
	describe,
	it,
	assert,
	expect,
	before,
	after,
	requester,
};