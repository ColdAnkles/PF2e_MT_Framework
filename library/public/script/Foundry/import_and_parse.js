"use strict";

function import_and_parse(key, type) {
	let property = JSON.parse(read_data("pz2e_" + type));
	let data = property[key];
	data = rest_call(data["fileURL"], "");
	let returnData = "";
	if (String(type) === "npc") {
		returnData = parse_npc(data);
	}
	return JSON.stringify(returnData);
}

MTScript.registerMacro("ca.pz2e.import_and_parse", import_and_parse);