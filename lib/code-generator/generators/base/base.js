import ejs from 'ejs';
import path from 'path';
import fsOld from 'fs-extra';
import {promissifyModule} from '../../../helpers';
import * as Reflection from '../../../reflection';
import {getDataHash} from '../../helpers';
import chalk from 'chalk';

let fs = promissifyModule(fsOld);

const templateCache = new Map();

const trigger = function(...triggers){
    return function(target, name, descriptor){
		triggers = triggers.filter(trigger => {
			if (typeof trigger === 'string'){
				return true;
			}
			console.error(`Wrong trigger ${trigger}: trigger must be a string`);
		});
		Reflection.annotate(descriptor.value, 'codeGeneratorTriggers', triggers);
	};
}

class Base{
    templateCache = templateCache;
    config = null;
    app = null;
    metadataFile = null;
    metadataFilePath = '.planckmeta'; //TODO: get from config

    constructor(app, metadataFile){
        this.app = app;
        this.config = app.config;
        this.metadataFile = metadataFile;
    }

    async render(template, params){
        return await Promise.resolve(typeof template === 'function' ? template(params) : ejs.render(template, params));
    }

    async getTemplate(templatePath){
        let template = this.templateCache.get(templatePath);
        if (!template){
            template = ejs.compile(await fs.readFile(path.join(process.cwd(), templatePath), 'utf8'));
            this.templateCache.set(templatePath, template);
        }
        return template;
    }

    async fireTrigger(triggerName, data){
        await this.app.codeGenerator.fireTrigger(triggerName, data);
    }

    async saveFile(destination, file, force = false){
        let oldMetadata = this.metadataFile.get(destination);
        if (!oldMetadata){
            await fs.outputFile(path.join(process.cwd(), destination), file);
            console.info(chalk.green.bold('generating new file:'), chalk.green(`${destination}`));
        } else if (!oldMetadata.isManualModified){
            await fs.outputFile(path.join(process.cwd(), destination), file);
            console.info(chalk.green.bold('re-generating old file:'), chalk.green(`${destination}`));
        } else {
            if (!force){
                console.warn(chalk.yellow.bold('can not re-generate file:'), chalk.yellow(`${destination}`), chalk.yellow.bold('because it was manually modified by user'));
                return;
            }
        }

        this.metadataFile.set(destination, {hash: getDataHash(file), isManualModified: false});
        let metadataFileString = '';
        //TODO: create file model
        for (let [key, entry] of this.metadataFile){
            metadataFileString += `${key} ${entry.hash} ${entry.isManualModified}\n`;
        }
        fs.outputFile(path.join(process.cwd(), this.metadataFilePath), metadataFileString);
    }
}

export default Base;
export {Base, trigger};
