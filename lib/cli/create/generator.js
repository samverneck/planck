import {loadPluginsInfo} from '../../helpers';

class Generators{
	constructor(){
	}
	async getGenerators(){
		this.coreGenerators = new Map((await loadPluginsInfo("generator", `${__dirname}/generators`)).map(el => [el.planck.name, el]));
		//this.externalGenerators = ['<none>'];
	}
	async run(name, params){
		try{
			let generator = await System.loader.import(this.coreGenerators.get(name).path);
			await generator.default.run(params);
		} catch(e) {
			console.log(e.stack);
		}
	}
}


export default new Generators();
