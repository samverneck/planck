import * as Controller from '../../../lib/controller/controller';
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
}

export default Admin;
