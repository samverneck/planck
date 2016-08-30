import path from 'path';

const isWindows = typeof process != 'undefined' && process.platform.match(/^win/);

class Config{
	/**
	 * @param {string|Object} [config="{cwd}/config/main.js"] path to config or object with config data
	 */
	constructor(config){
		Object.assign(this, config);
	}

	static async create(config = path.join(process.cwd(), 'config', 'main')){
		if (typeof config === 'string'){
			try {
				let data = await System.loader.import(config);
				if (!Config.isValid(data.default)){
					throw new Error('invalid config');
				}
				return new Config(data.default);
			} catch(err){
				throw new TypeError(`wrong config data, can not start app: ${err}`);
			}
		} else if ((config !== null) && (typeof config === 'object') && !(config instanceof Array)){
			return new Config(config);
		}
		throw new TypeError('Wrong config data, can not start app. Config must be a string with path to config file or json with data');
	}

	static isValid(configObject){
		return true;
	}
}

export default Config;
