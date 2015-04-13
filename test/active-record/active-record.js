const chai = require("chai");
const should = chai.should();
const ActiveRecord = require('../../lib/active-record/active-record.js');

describe('active-record', () => {
	it('should have "Base" class', () => {
		ActiveRecord.Base.should.be.a('function');
	});

	describe('"Base" class', () => {
		it('should have init method', () => {
			ActiveRecord.Base.init.should.be.a('function');
		});
		it('init method should not be called without subclassing', () => {
			ActiveRecord.Base.init.bind(ActiveRecord.Base).should.throw(TypeError);
			class A extends ActiveRecord.Base{

			}
			A.init.bind(ActiveRecord.Base).should.throw(TypeError);
			A.init.bind(A).should.not.throw(TypeError);
		});
	});
});