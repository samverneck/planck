import {ObjectID} from 'mongodb';

let A = [{
    _id: new ObjectID('55c49eb60ab6c5fa43e76f98'),
    id: 3,
    name: 'foo',
    blocked: false,
    tokens: [],
    position: {
        alt: 0,
        long: 0
    }
}, {
    _id: new ObjectID('55c49eb60ab6c5fa43e76f99'),
    id: 2,
    name: 'foo2',
    blocked: false,
    tokens: [],
    position: {
        alt: 0,
        long: 0
    }
}, {
    _id: new ObjectID('55c49eb60ab6c5fa43e76f9a'),
    id: 2,
    name: 'foo1',
    blocked: false,
    tokens: [],
    position: {
        alt: 0,
        long: 0
    }
}, {
    _id: new ObjectID('55c49eb60ab6c5fa43e76f9b'),
    id: 1,
    name: 'foo',
    blocked: false,
    tokens: [],
    position: {
        alt: 0,
        long: 0
    }
}];

export {
    A
};
