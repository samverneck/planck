import {Controller} from 'planck';
import AppController from './app-controller';

console.log(Controller, AppController)
//checking constructor which actualy is not a view
@Controller.useViews(function(){})
class Admin extends AppController{
	constructor(){
		super();
	}
	@Controller.useViews('base')
	getInfo(){

	}

	fail500route(){
		throw new Error();
	}

	@Controller.useViews('error-500-to-404-view')
	fail500to404route(){
		throw new Error();
	}
}

export default Admin;
