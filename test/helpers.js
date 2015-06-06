import chai from 'chai';
import * as Planck from '../index';
import fs from 'fs';
import path from 'path';

const should = chai.should();

describe('helpers', () => {
	it('promissify should return clone of function, changed to promissified api where result will be resolved by promise, insted of returned in callback', async (done) => {
		let myFunction = function(param, callback){
			callback(null, param);
		}
		let myFunctionPromissified = Planck.helpers.promissify(myFunction);
		try{
			let result = await myFunctionPromissified(1)
			result.should.be.equal(1);
			done();
		} catch(err) {
			done(err);
		}
	});
	it('promissify should return clone of function, changed to promissified api where error will be rejected by promise, insted of returned in callback', async (done) => {
		let myFunction = function(param, callback){
			callback("error");
		}
		let myFunctionPromissified = Planck.helpers.promissify(myFunction);
		try{
			let result = await myFunctionPromissified(1)
			done(new Error("error is not thrown via Promise.reject"));
		} catch(err) {
			err.should.be.equal("error");
			done();
		}
	});
	it('promissifyModule should return clone of module, with all methods changed to promissified api', async (done) => {
		let myFs = Planck.helpers.promissifyModule(fs);
		try{
			let stat = await myFs.stat(__dirname)	
			stat.isDirectory().should.be.true;
			done();
		} catch(err) {
			done(err);
		}
	});
});