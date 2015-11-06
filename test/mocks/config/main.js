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
		path: './test/mocks/controllers/'
	}
};

export default config;
