import {CodeGenerator} from 'planck';

import fsOld from 'fs-extra';
import {helpers} from 'planck';
import pathModule from 'path';

const fs = helpers.promissifyModule(fsOld);

class NativeController extends CodeGenerator.Base{
    constructor(...params){
        super(...params);
    }

    @CodeGenerator.trigger('NEW_MODEL_CREATED')
    async createNewController(data){
        // let templatePath = 'templates/controller.js.ejs';
        // let template = await this.getTemplate(templatePath);
        // let generatedController = await CodeGenerator.Base.prototype.render.call(this, template, data);
        // let path = pathModule.join(process.cwd(), this.config.controllers.path, data.name + '.js');
        // await fs.outputFile(path, generatedController);
    }
}

export default NativeController
