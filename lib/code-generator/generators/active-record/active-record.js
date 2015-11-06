import path from '@node/path';
import fsOld from '@node/fs';
import ejs from '@node/ejs';
import Base from '../base/base';
import {promissifyModule} from '../../../helpers';
let fs = promissifyModule(fsOld);

let templateCached = null;

class ActiveRecord extends Base{
    static async render(data){
        let template = templateCached || ejs.compile(await fs.readFile(path.join(__dirname, 'templates', 'active-record.js.ejs'), 'utf8'));
        let generatedActiveRecord = await super.render(template, data);
        console.log(generatedActiveRecord);
        return generatedActiveRecord;
    }
}

export default ActiveRecord;
