require("dotenv").config();

// const app = require('../app');
const { NODE_ENV } = process.env;

const {
	describe, 
	it,
	before,
	after,
} = require("mocha");

const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const {
	assert,
	expect,
} = chai;

// const requester = chai.request(app).keepOpen();

const sinon = require("sinon");

const foo = "bar";
const beverages = { tea: ["chai", "matcha", "oolong"] };


function compare(former, latter, callback) {
	callback();
	return former === latter;
}

function add(a, b) {    
	return a + b;
}

before("Initail Check before any test case", async() => {
	if (NODE_ENV !== "test") {
		throw new Error("Not in test env");
	}
	await console.log("asfasf");
});


describe("測試add函數", () => {

	it("測試5+5預期10", ()=> {
		if (add(5, 5) !== 10) {
			expect(add(5, 5)).to.be.equal(10);
			expect(add(6, 4)).to.be.equal(10);
			expect(add(7, 3)).to.be.equal(10);
		}
	});
	
	it("Sample", () => {
		assert.typeOf(foo, "string"); // without optional message
		assert.typeOf(foo, "string", "foo is a string"); // with optional message
		assert.equal(foo, "bar", "foo equal `bar`");
		assert.lengthOf(foo, 3, "foo`s value has a length of 3");
		assert.lengthOf(beverages.tea, 3, "beverages has 3 types of tea");
	});
    
});

describe("Spy Test", () => {
	it("測試呼叫次數", () => {
		const nameList = ["Nina", "Ricky"];
		const callback = sinon.spy();

		compare(nameList[0], nameList[0], callback);
		expect(callback.callCount).to.equal(1);
	});
});


after(async() => {
	console.log("After is done!");

	// requester.close();
});