import Base, {trigger} from '../base/base';
import pathModule from 'path';

class NativeController extends Base{
    constructor(...params){
        super(...params);
    }

    @trigger('NEW_CONTROLLER')
    async createNewController(data){

        let templatePath = 'templates/controller.js.ejs';
        let template = await this.getTemplate(templatePath);
        let generatedController = await this.render(template, data);
        let path = pathModule.join(this.config.controllers.path, data.name + '.js');
        await this.saveFile(path, generatedController);
    }
}

export default NativeController
