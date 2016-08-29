import chai from 'chai';
import App from '../lib/app';
import cleanApp from './cleanApp';

const should = chai.should();

describe('app', () => {
	it('should have "App" class', () => {
		should.exist(App);
		App.should.be.a('function');
	});
	describe('"App" class', () => {
		it('should accept Object as constructor param with entire application params', async () => {
			let config = await System.loader.import(`.${process.env.UNDER_NODE_BABEL?'':'/build'}/test/mocks/config/main`);
			const app = await new App(config.default);
			await app.start();
			app.should.be.instanceof(App);
			should.exist(app.config);
			app.config.appName.should.be.equal('testApp');
			await cleanApp(app);
		});
		it('should accept string as constructor param, string is path to config', async () => {
			const app = await new App(`.${process.env.UNDER_NODE_BABEL?'':'/build'}/test/mocks/config/main`);
			await app.start();
			app.should.be.instanceof(App);
			should.exist(app.config);
			app.config.appName.should.be.equal('testApp');
			await cleanApp(app);
		});
		it('should work without constructor params with default path to config', async () => {
			let cwd = process.cwd();
			process.chdir(`.${process.env.UNDER_NODE_BABEL?'':'/build'}/test/mocks`);
			const app = await new App();
			await app.start();
			process.chdir(cwd);
			app.should.be.instanceof(App);
			should.exist(app.config);
			app.config.appName.should.be.equal('testApp');
			await cleanApp(app);
		});
		it('should fail with any other params to constructor', async () => {
			try{
				await new App([]);
			}catch(e){
				return;
			}
			throw new Error();
		});
		it('should have "use" method', async () => {
			const app = await new App(`.${process.env.UNDER_NODE_BABEL?'':'/build'}/test/mocks/config/main`);
			await app.start();
			app.use.should.be.a('function');
			await cleanApp(app);
		});
	});
});
