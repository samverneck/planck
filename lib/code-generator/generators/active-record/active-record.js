import path from 'path';
import fsOld from 'fs';
import ejs from 'ejs';
import Base from '../base/base';
import {promissifyModule} from '../../../helpers';
let fs = promissifyModule(fsOld);

let templateCache = new Map();

class ActiveRecord extends Base{
    static async render(data, templatePath = '__default'){
        let template = templateCache.get(templatePath);
        if (!template){
            if (templatePath === '__default'){
                template = ejs.compile(await fs.readFile(path.join('/', __dirname, 'templates', 'active-record.js.ejs'), 'utf8'));
            } else {
                template = ejs.compile(await fs.readFile(path.join(process.cwd(), templatePath), 'utf8'));
            }
            templateCache.set(templatePath, template);
        }

        let generatedActiveRecord = await Base.render.call(this, template, data);
        return generatedActiveRecord;
    }
}

export default ActiveRecord;
