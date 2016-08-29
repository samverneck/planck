import Base, {trigger} from '../base/base';
import pathModule from 'path';

class NativeModel extends Base{
    constructor(...params){
        super(...params);
    }

    @trigger('NEW_MODEL')
    async createNewModel(data){
        let templatePath = 'templates/model.js.ejs';
        let template = await this.getTemplate(templatePath);
        let generatedModel = await this.render(template, data);
        let path = pathModule.join(this.config.models.path, data.name + '.js');
        await this.saveFile(path, generatedModel);
        await this.fireTrigger('NEW_MODEL_CREATED', {name: data.name, generatedModel});
    }
}

export default NativeModel;
