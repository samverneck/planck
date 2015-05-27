import oldFs from 'fs';
import path from 'path';

let promissify = function(method){
	return function(...params){
		return new Promise(function(resolve, reject) {
			params.push(function(err, result){
				if (err){
					reject(err);
				} else {
					resolve(result);
				}
			});
			method.apply(method, params);
		});
	};
};

let promissifyModule = function(module){
	let promissifiedModule = {};
	for (let method in module){
		if (typeof module[method] === "function"){
			promissifiedModule[method] = promissify(module[method]);
		}
	}
	return promissifiedModule;
};

let fs = promissifyModule(oldFs);

const pluginTypes = new Set(["generator"]);

let loadPluginsInfo = async function(type, pluginsPath){
	let plugins = [];
	await * (await fs.readdir(pluginsPath)).map(async(plugin) => {
		if ((await fs.stat(path.join(pluginsPath, plugin))).isDirectory()){
			try {
				let res = JSON.parse(await fs.readFile(path.join(pluginsPath, plugin, "package.json"), "utf8"));
				if ((res.planck && (type === res.planck.moduleType || (type === "all" && pluginTypes.has(res.planck.moduleType))))){
					res.path = path.join(pluginsPath, plugin);
					plugins.push(res);
				}
			} catch(e) {
			}
		}
	});
	return plugins;
};

export {promissify, promissifyModule, loadPluginsInfo};