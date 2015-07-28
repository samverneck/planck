import {symbols} from '../../../../reflection';

class BaseProvider{
	constructor(){

	}

	calcQuery(){
		throw new Error('Can not run query to db');
	}

	getDefaults(model){
		model.prototype[symbols.dbPrimaryKey] = model.prototype[symbols.dbPrimaryKey] || 'id';
	}
}

export default BaseProvider;
