import * as fs from 'fs';

class Config{
	/**
	 * @constructs App
	 * @param {string|Object} [config="{cwd}/config/main.js"] path to config or object with config data
	 */		
	constructor(config){
		return new Promise((resolve, reject) => {
			let configPath = config;
			if (typeof(config) === "undefined"){
				configPath = process.cwd()+"/config/main";
			}

			if ((typeof(config) === "string") || (typeof(config) === "undefined")){
				System.import(configPath).then((data) => {
					if (Config.isValid(data.default)){
						Object.assign(this, data.default);
						resolve(this);
					}else{
						reject(new TypeError("wrong config data, can not start app"));
					}
				},(err) => {
					reject(new TypeError("wrong config data, can not start app"));
				});
			} else if ((config !== null) && (typeof config === 'object') && !(config instanceof Array)){
				if (Config.isValid(config)){
					Object.assign(this, config);
				}
				resolve(this);
			} else {
				reject(new TypeError("wrong config data, can not start app"));
			}
		});
	}
	static isValid(configObject){
		return true;
	}
}

export default Config;