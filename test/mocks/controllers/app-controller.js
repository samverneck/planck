import * as Controller from '../../../lib/controller/controller';

@Controller.useViews('json-wrap-view')
class AppController extends Controller.Base{
	constructor(){
		super();
	}
	read(params){
		this.user = params;
	}

	readAll(params){
		this.res = "readAll";
	}
	update(params){
		this.res = "update";
	}
}

export default AppController;