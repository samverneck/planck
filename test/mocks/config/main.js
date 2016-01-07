import database from './database';

const config = {
	appName: 'testApp',
	database: database,
	http: {
		port: 9000
	},
	codeGeneration: {
		autoGeneration: false
	},
	controllers: {
		path: 'controllers'
	},
	models: {
		path: 'models',
		template: '../../mocks/templates/model.js.ejs'
	},
	bodyParser: {
		limit: '100kb'
	}
};

export default config;
