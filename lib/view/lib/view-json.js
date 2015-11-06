import Base from './view-base.js';

class Json extends Base{
	constructor(){
		super();
	}
	resolve(data){
		return data;
	}
	reject(error){
		return error;
	}
}

export default Json;
