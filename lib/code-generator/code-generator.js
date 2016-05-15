import Controller from './generators/controller/controller';
import Model from './generators/active-record/active-record';
import path from 'path';
import fsOld from 'fs';
import {promissifyModule} from '../helpers';
let fs = promissifyModule(fsOld);

class CodeGenerator{
    static async generate(type, data, outPath, template){
        switch (type){
            case 'controller':
                let generatedController = await Controller.render(data, template);
                await fs.writeFile(outPath, generatedController);
            break;
            case 'model':
                let generatedModel = await Model.render(data, template);
                await fs.writeFile(outPath, generatedModel);
            break;
            default:

            break;
        }
    }

    static async generateIfNotExists(type, data, dest, template){
        let outPath = path.join(process.cwd(), dest, data.name + '.js');
        let current = process.cwd();
        for (let folder of dest.split(path.sep)){
            current = path.join(current, folder);
            try{
                await fs.mkdir(current);
            } catch(e) {
            }
        }

        try{
            await fs.stat(outPath);
        } catch(e) {
            if(e.code === 'ENOENT'){
                return await this.generate(type, data, outPath, template);
            }
        }
    }
}

export default CodeGenerator;
