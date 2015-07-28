import DatabaseCleaner from 'database-cleaner';
import {MongoClient} from 'mongodb';
import * as mocks from './db-mocks';

let mongoUri = 'mongodb://127.0.0.1:27017/testDB';
let mongoCleaner = new DatabaseCleaner('mongodb');

describe('Init database for tests', () => {
    it('Connect to mongodb', async (done) => {
        try{
            global.mongo = await MongoClient.connect(mongoUri);
            done();
        } catch (e) {
            done(e);
        }
    });

    it('Clean mongodb', (done) => {
        mongoCleaner.clean(mongo, () => {
            done();
        });
    });

    it('Put mocks to mongodb', async (done) => {
        try{
            for (let mock in mocks){
                await mongo.collection(mock).insert(mocks[mock], { safe: true });
            }
            done();
        } catch(e) {
            done(e);
        }
    });
});
