import * as Controller from '../../../lib/controller/controller';
import AppController from './app-controller';

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