import * as View from '../../view/view.js';
import {useViews} from './helpers.js';

/**
 * @class  
 * @classdesc Base class is the main class to inherit user controllers from. It provided some
 * placeholders for methods, used by restful api for easier begining of testin user's rest routes.
 * If used as http controller - new instance will be created on each request. All controller's
 * methods should be async. Any data, needed to render for client should be written to 'this'
 */
@useViews(View.Json)
class Base {
	constructor(){

	}

	async create(){

	}

	async read(){

	}

	async readAll(){

	}

	async update(){

	}

	async delete(){

	}
}

export default Base;