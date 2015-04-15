const chai = require("chai");
const should = chai.should();
const ActiveRecord = require('../../lib/active-record/active-record.js');

describe('active-record', () => {
	it('should have "Base" class', () => {
		ActiveRecord.Base.should.be.a('function');
	});

	describe('"Base" class', () => {
		it('should have "init" method', () => {
			ActiveRecord.Base.init.should.be.a('function');
		});
		describe('"init" method', () => {
			var A;
			beforeEach(function(){
				A = class A extends ActiveRecord.Base{
					constructor(){
						super();
						this.id = 0;
						this.name = "foo";
						this.blocked = false;
						this.tokens = [];	
						this.position = {
							alt: 0,
							long: 0
						}
					}
				}
			});
			it('should not be called without subclassing', () => {
				ActiveRecord.Base.init.bind(ActiveRecord.Base).should.throw(TypeError);
				A.init.bind(ActiveRecord.Base).should.throw(TypeError);
				A.init.bind(A).should.not.throw(TypeError);
			});
			it('should create access methods for each atomic field in constructor', () => {
				A.init();
				A.getById.should.be.a('function');
				A.getByName.should.be.a('function');
				A.getByBlocked.should.be.a('function');
				should.not.exist(A.getByTokens);
				should.not.exist(A.getByPosition);
			});
			it('should create chainable access methods', () => {
				A.init();
				A.getById(123, 456).getById("asd").getById(false);
				A.getById(654, 321).getById("qwe").getById(true);
			});
		});
	});
});