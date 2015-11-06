import * as View from '../../../lib/view/view';

class HTMLTestView extends View.Json{
	constructor(){
		super();
	}
	resolve(data){
		return `<html><body>${JSON.stringify(data)}</body></html>`;
	}
}

export default HTMLTestView;
