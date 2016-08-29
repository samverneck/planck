import path from 'path';
import fsOld from 'fs-extra';
import {promissifyModule, promissify} from '../helpers';
import {getMetadata} from '../reflection';
import globOld from 'glob';
import {getFileHash} from './helpers';
import chalk from 'chalk';

const fs = promissifyModule(fsOld);
const glob = promissify(globOld);

const preDefinedGenerators = {
    'native-model': './generators/native-model/native-model',
    'native-controller': './generators/native-controller/native-controller'
};

async function uploadMetadata(metadataFilePath){
    let result = new Map();
    try{
        let metadataFile = await fs.readFile(path.join(process.cwd(), metadataFilePath), 'UTF-8');
        metadataFile = metadataFile.split(/\r\n|[\n\r\u0085\u2028\u2029]/g).filter(el => el.length);
        let promises = [];
        for (let entry of metadataFile){
            let [filePath, hash, isManualModified] = entry.split(/\s+/g);
            let possibleDuplicate = result.get(filePath);
            if (possibleDuplicate){
                isManualModified = isManualModified || possibleDuplicate.isManualModified;
            }
            result.set(filePath, {hash, isManualModified});
        }
        for (let [filePath, {hash, isManualModified}] of result){
            promises.push((async function(){
                try{
                    let newHash = await getFileHash(filePath);
                    isManualModified = newHash !== hash;
                    result.set(filePath, {hash: newHash, isManualModified});
                } catch (e) {
                    if (e.code !== 'ENOENT'){
                        throw e;
                    }
                    console.warn(chalk.yellow.bold('file '), chalk.yellow(`${filePath}`), chalk.yellow.bold('not found, removing from metadata'));
                }
            })());
        }
        await Promise.all(promises);
        let metadataFileString = '';
        for (let [key, entry] of result){
            metadataFileString += `${key} ${entry.hash} ${entry.isManualModified}\n`;
        }
        fs.outputFile(path.join(process.cwd(), metadataFilePath), metadataFileString);
    } catch (e) {
        if (e.code !== 'ENOENT'){
            console.error(e.stack);
            throw e;
        }
    }
    return result;
}

class CodeGenerator{
    generators = new Map();
    generatorsByTriggers = new Map();
    config = null;
    app = null;
    metadataFilePath = '.planckmeta'; //TODO: get from config
    metadataFile = null;

    constructor(app){
        this.app = app;
        this.config = app.config;
    }

    static async create(app){
        let result = new CodeGenerator(app);
        let generators = [];
        for (let generator of app.config.codeGeneration.generators){
            if (preDefinedGenerators[generator]){
                generators.push(path.join(__dirname, preDefinedGenerators[generator]));
            } else {
                let files = await glob(generator, {nodir: true});
                generators = generators.concat(files);
            }
        }
        generators = await Promise.all(generators.map(el => System.loader.import(el)));
        result.metadataFile = await uploadMetadata(result.metadataFilePath);
        for (let generator of generators){
            let constructedGenerator = new generator.default(app, result.metadataFile);
            for (let method of Reflect.ownKeys(generator.default.prototype).filter(el => el !== 'constructor')){
                let triggers = getMetadata(generator.default.prototype[method], 'codeGeneratorTriggers');
                if (!triggers){
                    continue;
                }
                for (let triggerName of triggers){
                    let trigger = result.generatorsByTriggers.get(triggerName);
                    if (!trigger){
                        trigger = [];
                        result.generatorsByTriggers.set(triggerName, trigger);
                    }
                    trigger.push(constructedGenerator[method].bind(constructedGenerator));
                }
            }
        }
        return result;
    }

    async fireTrigger(triggerName, data){
        let generators = this.generatorsByTriggers.get(triggerName) || [];
        await Promise.all(generators.map(el => el(data)));
    }
}

export default CodeGenerator;
