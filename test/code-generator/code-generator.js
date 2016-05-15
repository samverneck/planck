import chai from 'chai';
import fs from 'fs';
import App from '../../lib/app';
import * as Router from '../../lib/router/router.js';

const should = chai.should();

describe('code-generator', () => {
    let app;
    let cwd;
    let locate;

    before(async (done) => {
        try{
            cwd = process.cwd();
            try{
                fs.mkdirSync(`.${process.env.UNDER_NODE_BABEL ? '' : '/build'}/test/code-generator/mocks`);
            } catch(e) {
            }

            process.chdir(`.${process.env.UNDER_NODE_BABEL ? '' : '/build'}/test/code-generator/mocks`);
            console.log(process.cwd());
            try{
                fs.mkdirSync('./controllers');
            } catch(e) {
            }
            fs.writeFileSync('./controllers/app-controller.js', `
                import {Controller} from 'planck';

                class AppController extends Controller.Base{
                	constructor(){
                		super();
                	}
                }

                export default AppController;
            `);
            let config = await System.loader.import(`../../mocks/config/main`);
            locate = System.locate;
            config.default.codeGeneration.autoGeneration = true;
            app = await new App(config.default);
            done();
        }catch(e){
            done(e);
        }
    });

    after(async (done) => {
        process.chdir(cwd);
        app.dbProviderPool.databases = {};
        let config = await System.loader.import(`./test/mocks/config/main`);
        System.locate = locate;
        config.default.codeGeneration.autoGeneration = false;
        app.httpServer.close(() => done());
    });

    describe('should create by information from router:', function() {
        this.timeout(10000)

        it('controllers', async (done) => {
            try{
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
            done();
        }catch(e){
            done(e)
        }
        });
	});
});
