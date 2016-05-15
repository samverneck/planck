import pkg from "../../../package.json";
import commander from "commander";
import generators from "./generator";

async function main(){
	try{
		await generators.getGenerators();
		commander.version(pkg.version);

		for (let [name, generator] of generators.coreGenerators){
			commander.command(`${name} <name> [args...]`)
				.description(generator.planck.description)
				.action(async (...options) => {
					await generators.run(name, options);
				});
		}

		commander.parse(process.argv);

		if(process.argv.length === 2) {
			commander.help();
		}
	} catch(e) {
		console.error(e);
	}
}

main();
