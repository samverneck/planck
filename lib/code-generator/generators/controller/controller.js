import path from '@node/path';
import fsOld from '@node/fs';
import ejs from '@node/ejs';
import Base from '../base/base';
import {promissifyModule} from '../../../helpers';
let fs = promissifyModule(fsOld);

let templateCache = new Map();

class Controller extends Base{
    static async render(data, templatePath = '__default'){
        let modulePath;
        if (typeof __moduleName === 'undefined'){
            modulePath = path.join('/', __dirname, '/').split('/');
        } else {
            modulePath = __moduleName.split('/');
        }
        modulePath.pop();
        modulePath.shift();
        let template = templateCache.get(templatePath);
        if (!template){
            if (templatePath === '__default'){
                template = ejs.compile(await fs.readFile(path.join('/', ...modulePath, 'templates', 'controller.js.ejs'), 'utf8'));
            } else {
                template = ejs.compile(await fs.readFile(path.join(process.cwd(), templatePath), 'utf8'));
            }
            templateCache.set(templatePath, template);
        }

        let generatedController = await super.render(template, data);
        return generatedController;
    }
}

export default Controller;
