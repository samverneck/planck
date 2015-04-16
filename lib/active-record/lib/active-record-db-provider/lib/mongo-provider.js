import BaseProvider from './base-provider';

class MongoProvider extends BaseProvider{
	constructor(){
		super();
	}

	calcQuery(chain){
		return chain;
	}
}

export default MongoProvider;
