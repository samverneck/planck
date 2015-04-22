"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
var pathModule = require('path');

global.System = global.System || {
	import: function(path) {
		return new Promise(function(resolve,reject){
			try{
				if (!pathModule.isAbsolute(path)){
					path = pathModule.join("..", path);
				}
				var _module = require(path);
				var module = _interopRequireWildcard(_module);
			}catch(e){
				reject(e);
			}
			resolve(module)
		})
	}
}