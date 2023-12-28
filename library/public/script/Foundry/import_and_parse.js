"use strict";

function import_and_parse(key, type){
	let libToken = get_runtime("libToken");
	let property = JSON.parse(libToken.getProperty("pf2e_"+type));
	let data = property[key];
	data = rest_call(data["fileURL"],"");
	let returnData = "";
	if (String(type) === "npc"){
		returnData = parse_npc(data);
	}
	return JSON.stringify(returnData);
}

MTScript.registerMacro("ca.pf2e.import_and_parse", import_and_parse);