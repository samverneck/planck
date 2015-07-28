import {symbols} from '../../reflection';

let id = function(idParams, field, descriptor){
    const setId = function(idParams, target, field, descriptor){
        if (Object.getOwnPropertySymbols(target.constructor.prototype).indexOf(symbols.dbPrimaryKey) !== -1){
            throw new Error('Model must have only one primary key!');
        }
        target.constructor.prototype[symbols.dbPrimaryKey] = field;
    };
    if (typeof field === 'undefined' && typeof descriptor === 'undefined'){
        return function(target, field, descriptor){
            setId(idParams, target, field, descriptor);
        };
    }
    setId({}, idParams, field, descriptor);
};

export {id};
