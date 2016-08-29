import chai from 'chai';
import * as Planck from '../lib/planck';
import fs from 'fs';
import path from 'path';

const should = chai.should();

describe('helpers', () => {
	it('promissify should return clone of function, changed to promissified api where result will be resolved by promise, insted of returned in callback', async () => {
		let myFunction = function(param, callback){
			callback(null, param);
		}
		let myFunctionPromissified = Planck.helpers.promissify(myFunction);
		let result = await myFunctionPromissified(1)
		result.should.be.equal(1);
	});
	it('promissify should return clone of function, changed to promissified api where error will be rejected by promise, insted of returned in callback', async () => {
		let myFunction = function(param, callback){
			callback("error");
		}
		let myFunctionPromissified = Planck.helpers.promissify(myFunction);
		try{
			let result = await myFunctionPromissified(1)
		} catch(err) {
			err.should.be.equal("error");
			return;
		}
		throw new Error("error is not thrown via Promise.reject");
	});
	it('promissifyModule should return clone of module, with all methods changed to promissified api', async () => {
		let myFs = Planck.helpers.promissifyModule(fs);
		let stat = await myFs.stat('/tmp')
		stat.isDirectory().should.be.true;
	});
});
