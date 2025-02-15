"use strict";

function get_pathbuilder_export_via_id(idNumber) {
	let baseURL = "https://pathbuilder2e.com/json.php?id=";
	idNumber = String(idNumber);
	let fullURL = baseURL + idNumber
	let data = rest_call(fullURL, "");
	if (data.success) {
		let parsed = null;
		try{
			parsed = parse_pathbuilder_export(data.build);
		} catch (e) {
			MapTool.chat.broadcast("Error in get_pathbuilder_export_via_id - parse pb export");
			MapTool.chat.broadcast("parsed: " + JSON.stringify(parsed));
			MapTool.chat.broadcast("" + e + "\n" + e.stack);
			return;
		}
		
		return parsed;
	} else {
		MapTool.chat.broadcast("Error retrieving Pathbuilder build");
	}
}

MTScript.registerMacro("ca.pf2e.get_pathbuilder_export_via_id", get_pathbuilder_export_via_id);

"use strict";

function get_pathbuilder_export_via_input() {
	MTScript.evalMacro("[h: input(\"pbData|Enter JSON|Pathbuilder JSON\")]")
	let pbData = JSON.parse(MTScript.getVariable("pbData")).build;
	let parsed = null;
	try{
		parsed = parse_pathbuilder_export(pbData);
	} catch (e) {
		MapTool.chat.broadcast("Error in get_pathbuilder_export_via_input - parse pb export");
		MapTool.chat.broadcast("parsed: " + JSON.stringify(parsed));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}
	return parsed;
}

MTScript.registerMacro("ca.pf2e.get_pathbuilder_export_via_input", get_pathbuilder_export_via_input);