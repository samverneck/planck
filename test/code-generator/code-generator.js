import chai from 'chai';
import fs from 'fs-extra';
import App from '../../lib/app';
import * as Router from '../../lib/router/router.js';

const should = chai.should();

describe('code-generator', () => {
    let app;
    let cwd;

    before(async () => {
        fs.removeSync(`.${process.env.UNDER_NODE_BABEL ? '' : '/build'}/test/code-generator/mocks`);
        cwd = process.cwd();
        fs.ensureDirSync(`.${process.env.UNDER_NODE_BABEL ? '' : '/build'}/test/code-generator/mocks`);
        process.chdir(`.${process.env.UNDER_NODE_BABEL ? '' : '/build'}/test/code-generator/mocks`);
        fs.outputFileSync('./controllers/app-controller.js', `
            import {Controller} from 'planck';

            class AppController extends Controller.Base{
            	constructor(){
            		super();
            	}
            }

            export default AppController;
        `);
        fs.copySync('../../mocks/templates/model.js.ejs', './templates/model.js.ejs');
        fs.copySync('../../mocks/templates/controller.js.ejs', './templates/controller.js.ejs');
        fs.copySync('../../mocks/generators/schema.js', './generators/schema.js');

        let config = await System.loader.import(`../../mocks/config/main`);
        config.default.codeGeneration.autoGeneration = true;
        app = await new App(config.default);
        await app.start();
    });

    after(async () => {
        let config = await System.loader.import(`../../mocks/config/main`);
        process.chdir(cwd);
        app.dbProviderPool.databases = {};
        config.default.codeGeneration.autoGeneration = false;
		return new Promise((resolve, reject) => {
			app.httpServer.close(() => resolve());
		})
    });

    describe('should create by information from router:', function() {
        this.timeout(10000)

        it('controllers', async () => {
            class MyRouter extends Router.RouterHTTP{
                constructor(resource, route){
                    super();
                    resource('users', () => {
                        resource('friends', ['update']);
                        route('admin', 'admin.getInfo');
                        route('/adminFromUsers');
                    });
                    resource('groups', () => {
                        resource('posts', ['create', 'read'], () => {
                            resource('comments');
                            resource('likes', ['read']);
                        });
                    });
                    route('/admin', 'admin.getInfo');
                    route('/my/password', 'users.password', ['get', 'post']);
                    route.get('/my/info', 'users.info');
                    route.post('/my/info', 'users.info');
                    route.put('/my/info', 'users.info');
                    route.patch('/my/info', 'users.info');
                    route.delete('/my/info', 'users.info');
                    route.get('/my/infoNoHandler', 'users.noHandlerForRoute');
                    route('/fail');
                    route('/fail2', 'onlyControllerName');
                }
            }
            await app.use(MyRouter);
        });
	});

    describe('should regenerate info', function() {
        this.timeout(10000)

        before(async () => {
            //restart app once more time to ensure some files was regenerated
            app.dbProviderPool.databases = {};
            await new Promise((resolve, reject) => app.httpServer.close(resolve));
            let config = await System.loader.import('../../mocks/config/main');
            app = await new App(config.default);
            await new Promise((resolve, reject) => fs.appendFile('models/users.js', '//changedLine', err => err ? reject(err) : resolve()));
            await new Promise((resolve, reject) => fs.appendFile('controllers/users.js', '//changedLine', err => err ? reject(err) : resolve()));
            await new Promise((resolve, reject) => fs.remove('controllers/friends.js', err => err ? reject(err) : resolve()));

            await app.start();
        });

        it('controllers', async () => {
            class MyRouter extends Router.RouterHTTP{
                constructor(resource, route){
                    super();
                    resource('users', () => {
                        route('admin', 'admin.getInfo');
                        route('/adminFromUsers');
                    });
                    resource('groups', () => {
                        resource('posts', ['create', 'read'], () => {
                            resource('comments');
                            resource('likes', ['read']);
                        });
                    });
                    route('/admin', 'admin.getInfo');
                    route('/my/password', 'users.password', ['get', 'post']);
                    route.get('/my/info', 'users.info');
                    route.post('/my/info', 'users.info');
                    route.put('/my/info', 'users.info');
                    route.patch('/my/info', 'users.info');
                    route.delete('/my/info', 'users.info');
                    route.get('/my/infoNoHandler', 'users.noHandlerForRoute');
                    route('/fail');
                    route('/fail2', 'onlyControllerName');
                }
            }
            await app.use(MyRouter);
        });
	});
});
