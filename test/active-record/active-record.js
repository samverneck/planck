import '../../index';
import App from '../../lib/app';
import chai from "chai";
import * as ActiveRecord from '../../lib/active-record/active-record';
import '../../lib/errors';

const should = chai.should();

describe('active-record', () => {
	before(async (done) => {
		await new App('test/mocks/config/main');
		done();
	});

	it('should have "Base" class', () => {
		ActiveRecord.Base.should.be.a('function');
	});

	describe('"Base" class', () => {
		it('should have "init" method', () => {
			ActiveRecord.Base.init.should.be.a('function');
		});
		describe('"init" method', () => {
			var A;
			beforeEach(() => {
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
						};
					}
				};
			});
			it('should not be called without subclassing', () => {
				ActiveRecord.Base.init.bind(ActiveRecord.Base).should.throw(AbstractClassError);
				A.init.bind(ActiveRecord.Base).should.throw(AbstractClassError);
				A.init.bind(A).should.not.throw(AbstractClassError);
			});
			it('should create access methods for each atomic field in constructor', () => {
				A.init();
				A.getById.should.be.a('function');
				A.getByName.should.be.a('function');
				A.getByBlocked.should.be.a('function');
				should.not.exist(A.getByTokens);
				should.not.exist(A.getByPosition);
			});
			it('should create chainable access methods', async (done) => {
				A.init();
				try{
					await A.getById(123, 456).getByName("asd").getByBlocked(false);
					await A.getById(654, 321).getByName("qwe").getByBlocked(true);
					done();
				}catch(e){
					done(e);
				}
			});
			it('should create chainable method "get"', () => {
				A.init();
				A.get.should.be.a('function');
			});
			it('should have field "database", accesed via setter/getter', () => {
				A.init();
				A.database = "mongo";
			});
			it('"database" field accessable only in subclass', (done) => {
				try{
					ActiveRecord.Base.database = "mongo";
					done(new Error());
				}catch(e){
					done();
				}
			});
		});
		it('result of any chainable method should be promise', async (done) => {
			let A = class A extends ActiveRecord.Base{
				constructor(){
					super();
					this.id = 0;
				}
			};
			A.init();
			A.get('45').getById('45').should.be.instanceOf(Promise);
			try{
				await A.get('45').getById('45');
				done();
			}catch(e){
				done(e);
			}
		});
		describe('"get" method', () => {
			var A;
			beforeEach(() => {
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
						};
					}
				};
				A.init();
			});
			it('should be chainable', async (done) => {
				try{
					await A.get({}).get('123').get('123', '456');
					done();
				}catch(e){
					done(e);
				}
			});
			it('should return promise', async (done) => {
				try{
					await A.get({}).get('123').get('123', '456');
					done();
				}catch(e){
					done(e);
				}
			});
			it('should be called with string params', async (done) => {
				try{
					await A.get(['123']).get('123').get('123', '456');
					done();
				}catch(e){
					done(e);
				}	
			});	
		});
	});
});