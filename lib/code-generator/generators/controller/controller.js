import path from '@node/path';
import fsOld from '@node/fs';
import ejs from '@node/ejs';
import Base from '../base/base';
import {promissifyModule} from '../../../helpers';
let fs = promissifyModule(fsOld);

let templateCached = null;

class Controller extends Base{
    static async render(data){
        let modulePath;
        if (typeof __moduleName === 'undefined'){
            modulePath = path.join('/', __dirname, '/').split('/');
        } else {
            modulePath = __moduleName.split('/');
        }
        modulePath.pop();
        modulePath.shift();
        let template = templateCached || ejs.compile(await fs.readFile(path.join('/', ...modulePath, 'templates', 'controller.js.ejs'), 'utf8'));
        let generatedController = await super.render(template, data);
        //console.log(generatedController);
        return generatedController;
    }
}

export default Controller;
