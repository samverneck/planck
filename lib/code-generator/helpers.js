import crypto from 'crypto';
import fsOld from 'fs-extra';
import {promissifyModule} from '../helpers';
import path from 'path';

const fs = promissifyModule(fsOld);

function getDataHash(data){
    return crypto.createHash('md5').update(data).digest('hex');
}

async function getFileHash(filePath){
    let data = await fs.readFile(path.join(process.cwd(), filePath), 'UTF-8');
    let hash = crypto.createHash('md5').update(data).digest('hex');
    return hash;
}

export {getDataHash, getFileHash}
