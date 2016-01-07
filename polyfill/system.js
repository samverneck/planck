'use strict';

require('systemjs');

System.config({
    defaultJSExtensions: true,
	transpiler: 'babel',
	paths: {
		'*': 'test/mocks/*',
		'code-generator/*': 'test/mocks/code-generator/mocks*',
        'planck': 'index'
	},
	map: {
		json: '../../node_modules/systemjs-plugin-json/json.js'
	},
	meta: {
		'*.json': {
			loader: 'json'
		}
	},
	babelOptions: {
		'stage': 0,
		'blacklist': [
			'es3.memberExpressionLiterals',
			'es3.propertyLiterals',
			'es5.properties.mutators',
			'es6.templateLiterals'
		]
	}
});
