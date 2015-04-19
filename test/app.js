import chai from "chai";
import App from '../lib/app.js';

const should = chai.should();

describe('app', () => {
	it('should have "App" class', () => {
		should.exist(App)
		App.should.be.a('function');
	});
	describe('"App" class', () => {
		it('should accept Object as constructor param with entire application params', () => {
			new App({}).should.be.instanceof(App);
		});
		it('should accept string as constructor param, string is path to config', () => {
			new App("/config/main.js").should.be.instanceof(App);
		});
		it('should work without constructor params with default path to config', () => {
			new App().should.be.instanceof(App);
		});
		it('should fail with any other params to constructor', () => {
			(function(){new App([])}).should.throw(TypeError);
		});
	});
});