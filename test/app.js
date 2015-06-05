import '../index';
import chai from 'chai';
import App from '../lib/app';

const should = chai.should();

describe('app', () => {
	it('should have "App" class', () => {
		should.exist(App)
		App.should.be.a('function');
	});
	describe('"App" class', () => {
		it('should accept Object as constructor param with entire application params', async (done) => {
			let config = await System.import(`.${process.env.UNDER_NODE_BABEL?'':'/build'}/test/mocks/config/main`);
			const app = await new App(config.default)
			app.should.be.instanceof(App);
			should.exist(app.config);
			app.config.appName.should.be.equal('testApp');
			app.dbProviderPool.databases = {};
			app.httpServer.close(() => done());
		});
		it('should accept string as constructor param, string is path to config', async (done) => {
			const app = await new App(`.${process.env.UNDER_NODE_BABEL?'':'/build'}/test/mocks/config/main`)
			app.should.be.instanceof(App);
			should.exist(app.config);
			app.config.appName.should.be.equal('testApp');
			app.dbProviderPool.databases = {};
			app.httpServer.close(() => done());
		});
		it('should work without constructor params with default path to config', async (done) => {
			let cwd = process.cwd();
			process.chdir(`.${process.env.UNDER_NODE_BABEL?'':'/build'}/test/mocks`);
			const app = await new App();
			process.chdir(cwd);
			app.should.be.instanceof(App);
			should.exist(app.config);
			app.config.appName.should.be.equal('testApp');
			app.dbProviderPool.databases = {};
			app.httpServer.close(() => done());
		});
		it('should fail with any other params to constructor', async (done) => {
			try{
				await new App([]);
				done(new Error);
			}catch(e){
				done();
			}
		});
		it('should have "use" method', async (done) => {
			const app = await new App(`.${process.env.UNDER_NODE_BABEL?'':'/build'}/test/mocks/config/main`);
			app.use.should.be.a('function');
			app.dbProviderPool.databases = {};
			app.httpServer.close(() => done());
		});
	});
});