import fs from 'fs';
import path from 'path';

import '../polyfill/system';

describe('planck test loader', function(done) {
    it('', function(done) {
        this.timeout(120000);
        let count = 0;
        let render = function(dir){
            let files = fs.readdirSync(path.join(__dirname, dir)).filter(el => el !== 'all.js' && el.indexOf('mocks') === -1);

            files.map(templatePath => {
                if (fs.statSync(path.join(__dirname, dir, templatePath)).isDirectory()){
                    render(path.join(dir, templatePath));
                } else {
                    count++;
                    System.import(path.join(__dirname, dir, templatePath))
                        .then(()=>{
                            count--;
                            if (!count){
                                done();
                            }
                        }).catch(e => {
                            count--;
                            if (!count){
                                done(e);
                            }
                        });
                }
            });
        };
        render('');
    });
});
