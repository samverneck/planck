"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
var pathModule = require('path');

/////////////////////////////////////////////////////////////////////////////dirty hack to force use polyfilled promises
var fs = require('fs');

global.Promise = undefined;
var prefix = "";
while (true){
	try{
		fs.statSync(pathModule.resolve(__dirname, prefix, 'node_modules'));
		break;
	}catch(e){
		prefix+="../"
	}
}

delete require.cache[pathModule.resolve(__dirname, prefix, 'node_modules/babel-core/node_modules/core-js/modules/es6.promise.js')];
require(pathModule.resolve(__dirname, prefix, 'node_modules/babel-core/node_modules/core-js/modules/es6.promise.js'));	
/////////////////////////////////////////////////////////////////////////////
if(!pathModule.isAbsolute) {
	pathModule.isAbsolute = require('path-is-absolute');
}

global.System = global.System || {
	import: function(path) {
		return new Promise(function(resolve, reject){
			try{
				if (!pathModule.isAbsolute(path)){
					path = pathModule.join(process.cwd(), path);
				}
				var _module = require(path);
				var module = _interopRequireWildcard(_module);
				resolve(module);
			}catch(e){
				reject(e);
			}
		})
	}
}