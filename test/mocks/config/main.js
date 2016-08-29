import database from './database';

const config = {
	appName: 'testApp',
	database: database,
	http: {
		port: 9000
	},
	codeGeneration: {
		autoGeneration: false,
		generators: ['native-model', 'native-controller', 'generators/*.js']
	},
	controllers: {
		path: 'controllers',
	},
	models: {
		path: 'models',
	},
	bodyParser: {
		limit: '100kb'
	}
};

export default config;
