import oldFs from 'fs';
import path from 'path';

function promissify(method){
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

function promissifyModule(module){
	let promissifiedModule = {};
	for (let method in module){
		if (typeof module[method] === 'function'){
			promissifiedModule[method] = promissify(module[method]);
		}
	}
	return promissifiedModule;
};

let fs = promissifyModule(oldFs);

const pluginTypes = new Set(['generator']);

async function loadPluginsInfo(type, pluginsPath){
	let plugins = [];
	await Promise.all(await fs.readdir(pluginsPath)).map(async(plugin) => {
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
