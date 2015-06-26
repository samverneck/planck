import ejs from 'ejs';
import fs from 'fs';
import path from 'path';

class Generator{
	constructor(){

	}
	async run(cliParams){
		let params = {appName: cliParams[0]};
		console.log(`${'creating'.lpad(10)}  ${cliParams[0]}`);

		try {
			fs.mkdirSync(cliParams[0]);
		} catch (err) {
			if (err.code != 'EEXIST'){
				throw err;
			}
		}

		let render =  function(dir){
			(fs.readdirSync(path.join(__dirname, 'templates', dir))).map((templatePath) => {
				if (( fs.statSync(path.join(__dirname, 'templates', dir, templatePath))).isDirectory()){
					try {
						console.log(`${'creating'.lpad(10)}  ${templatePath.lpad(templatePath.length+(dir.length?2:0)+dir.split(path.sep).length*2)}`);
						fs.mkdirSync(path.join(cliParams[0], dir, templatePath));
					} catch(err) {
						if (err.code != 'EEXIST'){
							throw err;
						}
					}
					render(path.join(dir, templatePath));
				}else{
					try {
						let newName = templatePath.slice(0,-path.extname(templatePath).length);
						console.log(`${'creating'.lpad(10)}  ${newName.lpad(newName.length+(dir.length?2:0)+dir.split(path.sep).length*2)}`);
						let template =  fs.readFileSync(path.join(__dirname, 'templates', dir, templatePath), "utf8");
						fs.writeFileSync(path.join(cliParams[0], dir, newName), ejs.render(template, params));
					} catch(e) {

					}
				}
			});
		}

		render("");
	}
}

export default new Generator();
