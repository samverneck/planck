'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
var pathModule = require('path');

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
		});
	}
};
