import database from './database';

const config = {
	appName: 'testApp',
	database: database,
	http: {
		port: 9000
	},
	controllers: {
		path: './test/mocks/controllers/'
	}
};

export default config;
