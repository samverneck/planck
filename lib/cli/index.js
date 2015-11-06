import pkg from "../../package.json!json";
import commander from "@node/commander";
import app from "./create/generators/app/index";

async function main(){
	try{
		commander.version(pkg.version);

		commander.command("app <name>")
			.description("create new app. alias for 'planck create app'")
			.action(async (...params) => {
				await app.run(params);
			});

		commander.command("create <generator> [args...]", "create something using generator");
		commander.parse(process.argv);

		if(process.argv.length === 2) {
			commander.help();
		}
	} catch(e) {
		console.error(e);
	}
}

main();
