import Controller from './generators/controller/controller';
import path from '@node/path';
import fsOld from '@node/fs';
import {promissifyModule} from '../helpers';
let fs = promissifyModule(fsOld);

class CodeGenerator{
    static async generate(type, data, outPath){
        switch (type){
            case 'controller':
                let generatedController = await Controller.render(data);
                await fs.writeFile(outPath, generatedController);
            break;
            default:

            break;
        }
    }

    static async generateIfNotExists(type, data, dest){
        let outPath = path.join(process.cwd(), dest, data.name + '.js');
        let outFolder = path.join(process.cwd(), dest);
        try{
            await fs.mkdir(outFolder);
        } catch(e) {
        }

        try{
            await fs.stat(outPath);
        } catch(e) {
            if(e.code === 'ENOENT'){
                return await this.generate(type, data, outPath);
            }
        }
    }
}

export default CodeGenerator;
