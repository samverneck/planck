import fs from 'fs';
import path from 'path';
import '../polyfill/system';
import Module from 'module';

//we need to alias 'planck' to '../index.js' because planck loads twice in code-generator
const _findPath = Module._findPath;

Module._findPath = function(request, paths, isMain) {
	if (request === 'planck'){
		request = '../index.js';
	}
	return _findPath.call(this, request, paths, isMain);
};

describe('planck test loader', function() {
    it('', function(done) {
        this.timeout(120000);
        let count = 0;
        let render = function(dir){
            let files = fs.readdirSync(dir).filter(el => el !== 'all.js' && el.indexOf('mocks') === -1);
            files.forEach(templatePath => {
                if (fs.statSync(path.join(dir, templatePath)).isDirectory()){
                    return render(path.join(dir, templatePath));
                }
                count++;
                System.loader.import(path.join(dir, templatePath)).catch(e => {}).then(()=>{
                    count--;
                    if (!count){
                        done();
                    }
                })
            });
        };
        render(__dirname);
    });
});
